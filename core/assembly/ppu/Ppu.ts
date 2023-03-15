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
  oam: Oam = new Oam()
  line: u16
  dot: u16
  dotColor: u8
  bgChar: u8
  oddFrame: bool

  control: Register<Control> = new Register<Control>()
  mask: Register<Mask> = new Register<Mask>()
  status: Register<Status> = new Register<Status>()

  v: u16
  t: u16
  x: u8
  w: bool

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
      this.frameBuffer[i] = 0xff
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

    const characterIndex = this.bus.vram[this.bus.mirrorVram(this.v & 0xfff)]
    const page = <u8>this.control.get(Control.BackgroundPattern)
    const character = this.bus.loadCharacter(characterIndex, page)
    this.bgChar = character.getPixel(<u8>((this.dot + this.x) & 0b111), this.getFineY())
    this.dotColor = this.bus.palette[0]

    if (this.bgChar == 0) return

    const attrAddress = 0x3c0 | (this.v & NN) | ((this.v >> 4) & 0b111000) | ((this.v >> 2) & 0b111)
    const attribute = this.bus.vram[this.bus.mirrorVram(<u16>attrAddress)]
    const quadrant = ((this.v >> 5) & 0b10) | ((this.v >> 1) & 0b1)
    const palette = (attribute >> (<u8>quadrant * 2)) & 0b11

    this.dotColor = this.bus.palette[palette * 4 + this.bgChar]
  }

  @inline
  renderSprites(): void {
    if (!this.mask.get(Mask.ShowSprites)) return
    if (!this.mask.get(Mask.ShowLeftSprites) && this.dot < 8) return

    const spritePage = <u8>this.control.get(Control.SpritePattern)
    this.oam.setDot(this.dot)
    let sprite: Sprite | null

    while ((sprite = this.oam.nextDotSprite())) {
      let spritePixelX = <u8>(this.dot - sprite.x)
      let spritePixelY = <u8>(this.line - 1 - sprite.y)
      if (sprite.flipHorizontal) spritePixelX = 7 - spritePixelX
      if (sprite.flipVertical) spritePixelY = 7 - spritePixelY

      const spriteCharacter = this.bus.loadCharacter(sprite.characterIndex, spritePage)
      const spriteCharColor = spriteCharacter.getPixel(spritePixelX, spritePixelY)

      if (spriteCharColor == 0) continue
      if (this.bgChar != 0 && sprite.index == 0) this.status.set(Status.SpriteZeroHit, true)
      if (this.bgChar != 0 && sprite.priority == 1) break

      this.dotColor = this.bus.palette[16 + sprite.palette * 4 + spriteCharColor]
      break
    }
  }

  @inline
  paintDot(color: u8): void {
    const index = (<i32>this.line * 256 + this.dot) * 4
    this.frameBuffer[index] = this.systemPalette[color][0]
    this.frameBuffer[index + 1] = this.systemPalette[color][1]
    this.frameBuffer[index + 2] = this.systemPalette[color][2]
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
