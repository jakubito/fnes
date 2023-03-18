import { Interrupts, Register } from '../main'
import { Interrupt } from '../main/enums'
import { Control, Mask, PpuMask, Status } from './enums'
import systemPalette from './palette'
import Sprite from './Sprite'
import Oam from './Oam'
import Bus from './Bus'

const y = <u16>PpuMask.y
const NN = <u16>PpuMask.NN
const N = <u16>PpuMask.N
const n = <u16>PpuMask.n
const Y = <u16>PpuMask.Y
const X = <u16>PpuMask.X

class Ppu {
  systemPalette: StaticArray<StaticArray<u8>> = systemPalette
  frameBuffer: Uint8Array = new Uint8Array(256 * 240 * 4)
  line: u16 = 0
  dot: u16 = 0
  dotColor: u8 = 0
  bgChar: u8 = 0
  oddFrame: bool = false

  control: Register<Control> = new Register<Control>()
  mask: Register<Mask> = new Register<Mask>()
  status: Register<Status> = new Register<Status>()
  oam: Oam = new Oam(this.control)

  v: u16 = 0
  t: u16 = 0
  x: u8 = 0
  w: bool = false

  constructor(private bus: Bus, private interrupts: Interrupts) {
    this.reset()
  }

  reset(): void {
    this.oddFrame = false
    this.line = 0
    this.dot = 0
    this.dotColor = 0
    this.bgChar = 0
    this.v = 0
    this.t = 0
    this.x = 0
    this.w = false
    this.control.reset()
    this.mask.reset()
    this.status.reset()
    this.frameBuffer.fill(0)
    this.oam.reset()

    // Set alpha channel to 0xff
    for (let i = 3; i < this.frameBuffer.length; i += 4) {
      unchecked((this.frameBuffer[i] = 0xff))
    }
  }

  @inline
  run(cycles: usize): void {
    for (let i: usize = 0; i < cycles; i++) this.step()
  }

  @inline
  step(): void {
    // Render screen
    if (this.line < 240 && this.dot < 256) {
      this.renderDot()
      if (this.renderingEnabled() && ((this.dot + this.x) & 0b111) == 7) this.incrementCoarseX()
    }
    // Increment fine Y; reset X scroll
    else if (this.renderingEnabled() && this.line < 240 && this.dot == 257) {
      this.incrementFineY()
      this.v = (this.v & ~(n | X)) | (this.t & (n | X))
    }
    // Load sprites for the next scanline
    else if (this.renderingEnabled() && this.line < 240 && this.dot == 320) {
      this.oam.resetLine()
      const spriteOverflow = this.oam.loadLine(this.line)
      this.status.set(Status.SpriteOverflow, spriteOverflow)
    }
    // Enter vertical blank
    else if (this.line == 241 && this.dot == 1) {
      this.status.set(Status.VerticalBlank, true)
      if (this.control.get(Control.GenerateNmi)) this.interrupts.trigger(Interrupt.Nmi)
    }
    // Exit vertical blank; reset sprites
    else if (this.line == 261 && this.dot == 1) {
      this.status.reset()
      this.oam.resetLine()
    }
    // Reset Y scroll
    else if (this.renderingEnabled() && this.line == 261 && this.dot == 304) {
      this.v = (this.v & ~(y | N | Y)) | (this.t & (y | N | Y))
    }
    // Skip cycle on odd frames
    else if (this.oddFrame && this.renderingEnabled() && this.line == 261 && this.dot == 339) {
      this.dot++
    }
    this.advanceDot()
  }

  @inline
  renderDot(): void {
    this.dotColor = 0xf
    this.bgChar = 0
    this.renderBackground()
    this.renderSprites()
    this.paintDot(this.dotColor)
  }

  @inline
  renderBackground(): void {
    if (!this.mask.get(Mask.ShowBackground)) return
    if (!this.mask.get(Mask.ShowLeftBackground) && this.dot < 8) return

    const characterIndex = unchecked(this.bus.vram[this.bus.mirrorVram(this.v & 0xfff)])
    const page = <u8>this.control.get(Control.BackgroundPattern)
    const character = this.bus.loadCharacter(characterIndex, page)
    this.bgChar = character.getPixel(<u8>((this.dot + this.x) & 0b111), this.getFineY())
    this.dotColor = unchecked(this.bus.palette[0])

    if (this.bgChar == 0) return

    const attrAddress = 0x3c0 | (this.v & NN) | ((this.v >> 4) & 0b111000) | ((this.v >> 2) & 0b111)
    const attribute = unchecked(this.bus.vram[this.bus.mirrorVram(<u16>attrAddress)])
    const quadrant = ((this.v >> 5) & 0b10) | ((this.v >> 1) & 0b1)
    const palette = (attribute >> (<u8>quadrant * 2)) & 0b11

    this.dotColor = unchecked(this.bus.palette[palette * 4 + this.bgChar])
  }

  @inline
  renderSprites(): void {
    if (!this.mask.get(Mask.ShowSprites)) return
    if (!this.mask.get(Mask.ShowLeftSprites) && this.dot < 8) return

    this.oam.setDot(this.dot)
    let sprite: Sprite | null

    while ((sprite = this.oam.nextDotSprite())) {
      const charColor = this.getSpriteCharacterColor(sprite)

      if (charColor == 0) continue
      if (this.bgChar != 0 && sprite.index == 0) this.status.set(Status.SpriteZeroHit, true)
      if (this.bgChar != 0 && sprite.priority == 1) break

      this.dotColor = unchecked(this.bus.palette[16 + sprite.palette * 4 + charColor])
      break
    }
  }

  @inline
  getSpriteCharacterColor(sprite: Sprite): u8 {
    const size = this.control.get(Control.SpriteSize)
    const page = size ? sprite.characterIndex & 1 : <u8>this.control.get(Control.SpritePattern)
    let charIndex = sprite.characterIndex & ~(<u8>size)
    let x = <u8>(this.dot - sprite.x)
    let y = <u8>(this.line - 1 - sprite.y)

    if (sprite.flipHorizontal) x = 7 - x
    if (sprite.flipVertical) y = <u8>size * 8 + 7 - y
    if (y > 7) {
      y -= 8
      charIndex++
    }

    const character = this.bus.loadCharacter(charIndex, page)
    return character.getPixel(x, y)
  }

  @inline
  paintDot(color: u8): void {
    let r = unchecked(unchecked(this.systemPalette[color])[0])
    let g = unchecked(unchecked(this.systemPalette[color])[1])
    let b = unchecked(unchecked(this.systemPalette[color])[2])

    const index = (<i32>this.line * 256 + this.dot) * 4
    const emphasizeRed = <u8>this.mask.get(Mask.EmphasizeRed)
    const emphasizeGreen = <u8>this.mask.get(Mask.EmphasizeGreen)
    const emphasizeBlue = <u8>this.mask.get(Mask.EmphasizeBlue)

    if (emphasizeRed | emphasizeGreen | emphasizeBlue) {
      const all = emphasizeRed & emphasizeGreen & emphasizeBlue
      r = this.emphasizeColor(r, emphasizeRed, all)
      g = this.emphasizeColor(g, emphasizeGreen, all)
      b = this.emphasizeColor(b, emphasizeBlue, all)
    }

    if (this.mask.get(Mask.Grayscale)) {
      r = this.convertToGrayscale(r, g, b)
      g = r
      b = r
    }

    unchecked((this.frameBuffer[index] = r))
    unchecked((this.frameBuffer[index + 1] = g))
    unchecked((this.frameBuffer[index + 2] = b))
  }

  @inline
  emphasizeColor(value: u8, emphasize: u8, emphasizeAll: u8): u8 {
    return <u8>Math.round(<f32>value * (0.75 + (emphasize & (~emphasizeAll & 1)) * 0.25))
  }

  @inline
  convertToGrayscale(red: u8, green: u8, blue: u8): u8 {
    const r = <f32>red / 255
    const g = <f32>green / 255
    const b = <f32>blue / 255
    return <u8>Math.round((r * 0.299 + g * 0.587 + b * 0.114) * 255)
  }

  @inline
  advanceDot(): void {
    this.dot++

    if (this.dot == 341) {
      this.dot = 0
      this.line++

      if (this.line == 262) {
        this.line = 0
        this.oddFrame = !this.oddFrame
      }
    }
  }

  @inline
  incrementCoarseX(): void {
    if ((this.v & X) < 31) {
      this.v++
    } else {
      this.v &= ~X
      this.v ^= n
    }
  }

  @inline
  incrementFineY(): void {
    if (this.getFineY() < 7) {
      this.v += 1 << 12
    } else {
      this.v &= ~y
      const coarseY = <u8>((this.v & Y) >> 5)
      if (coarseY == 29) {
        this.setCoarseY(0)
        this.v ^= N
      } else if (coarseY == 31) {
        this.setCoarseY(0)
      } else {
        this.setCoarseY(coarseY + 1)
      }
    }
  }

  @inline
  getFineY(): u8 {
    return <u8>((this.v & y) >> 12)
  }

  @inline
  setCoarseY(value: u8): void {
    this.v = (this.v & ~Y) | ((<u16>value) << 5)
  }

  @inline
  setControl(value: u8): void {
    const previousGenerateNmi = this.control.get(Control.GenerateNmi)
    this.control.setValue(value)
    this.t = (this.t & ~(0b11 << 10)) | ((<u16>(value & 0b11)) << 10)
    this.handleControlNmiChange(previousGenerateNmi)
  }

  @inline
  handleControlNmiChange(previousValue: bool): void {
    if (previousValue) return
    if (!this.control.get(Control.GenerateNmi)) return
    if (!this.status.get(Status.VerticalBlank)) return
    this.interrupts.trigger(Interrupt.Nmi)
  }

  @inline
  setScroll(value: u8): void {
    if (this.w) {
      this.t &= ~(y | Y)
      this.t |= (<u16>(value & 0b111)) << 12
      this.t |= (<u16>(value & ~0b111)) << 2
    } else {
      this.t = (this.t & ~X) | (value >> 3)
      this.x = value & 0b111
    }
    this.w = !this.w
  }

  @inline
  setAddress(value: u8): void {
    if (this.w) {
      this.t = (this.t & ~0xff) | value
      this.v = this.t
    } else {
      this.t = (this.t & 0xff) | ((<u16>(value & 0b111111)) << 8)
    }
    this.w = !this.w
  }

  @inline
  loadFromAddress(): u8 {
    const address = this.v
    this.incrementV()
    return this.bus.load(address & 0x3fff)
  }

  @inline
  storeToAddress(value: u8): void {
    this.bus.store(this.v & 0x3fff, value)
    this.incrementV()
  }

  @inline
  incrementV(): void {
    this.v += this.control.get(Control.VramIncrement) ? 32 : 1
  }

  @inline
  readStatus(): u8 {
    const value = this.status.value
    this.status.set(Status.VerticalBlank, false)
    this.w = false
    return value
  }

  @inline
  renderingEnabled(): bool {
    return this.mask.get(Mask.ShowBackground) || this.mask.get(Mask.ShowSprites)
  }
}

export default Ppu
