import { Interrupts, Register } from '../main'
import { Interrupt } from '../main/enums'
import { Control, Mask, Status } from './enums'
import systemPalette from './palette'
import Address from './Address'
import Scroll from './Scroll'
import Sprite from './Sprite'
import Oam from './Oam'
import Bus from './Bus'

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
  address: Address = new Address(this.control)
  scroll: Scroll = new Scroll()

  constructor(private bus: Bus, private interrupts: Interrupts) {
    this.reset()
  }

  reset(): void {
    this.oddFrame = false
    this.line = 0
    this.dot = 0
    this.dotColor = 0
    this.bgChar = 0
    this.control.reset()
    this.mask.reset()
    this.status.reset()
    this.address.reset()
    this.scroll.reset()
    this.frameBuffer.fill(0)
    this.oam.reset()
    for (let i = 3; i < this.frameBuffer.length; i += 4) this.frameBuffer[i] = 0xff
  }

  @inline
  run(cycles: usize): void {
    for (let i: usize = 0; i < cycles; i++) this.step()
  }

  @inline
  step(): void {
    if (this.line < 240 && this.dot < 256) {
      this.renderDot()
    } else if (this.line < 240 && this.dot == 320) {
      this.oam.resetLine()
      const spriteOverflow = this.oam.loadLine(this.line)
      this.status.set(Status.SpriteOverflow, spriteOverflow)
    } else if (this.line == 241 && this.dot == 1) {
      this.status.set(Status.VerticalBlank, true)
      if (this.control.get(Control.GenerateNmi)) this.interrupts.trigger(Interrupt.Nmi)
    } else if (this.line == 261 && this.dot == 1) {
      this.status.reset()
      this.oam.resetLine()
    } else if (this.oddFrame && this.renderingEnabled() && this.line == 261 && this.dot == 339) {
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

    const nametableIndex = Math.floor(this.line / 8) * 32 + Math.floor(this.dot / 8)
    const characterIndex = this.bus.vram[<u16>nametableIndex]

    const page = <u8>this.control.get(Control.BackgroundPattern)
    const character = this.bus.loadCharacter(characterIndex, page)
    this.bgChar = character.getPixel(<u8>this.dot % 8, <u8>this.line % 8)
    this.dotColor = this.bus.palette[0]

    if (this.bgChar != 0) {
      const attributeIndex = Math.floor(this.line / 32) * 8 + Math.floor(this.dot / 32)
      const attributeAddress = 0x3c0 + attributeIndex
      const attribute = this.bus.vram[<u16>attributeAddress]
      const quadrant = Math.floor((this.line % 32) / 16) * 2 + Math.floor((this.dot % 32) / 16)
      const palette = (attribute >> (<u8>quadrant * 2)) & 0b11
      this.dotColor = this.bus.palette[palette * 4 + this.bgChar]
    }
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
  setControl(value: u8): void {
    const previousGenerateNmi = this.control.get(Control.GenerateNmi)
    this.control.setValue(value)
    this.handleControlNmiChange(previousGenerateNmi)
  }

  @inline
  handleControlNmiChange(previousValue: bool): void {
    if (previousValue) return
    if (!this.control.get(Control.GenerateNmi)) return
    if (!this.status.get(Status.VerticalBlank)) return
    this.interrupts.trigger(Interrupt.Nmi)
  }

  loadFromAddress(): u8 {
    const address = this.address.value
    this.address.increment()
    return this.bus.load(address)
  }

  @inline
  storeToAddress(value: u8): void {
    this.bus.store(this.address.value, value)
    this.address.increment()
  }

  @inline
  readStatus(): u8 {
    const value = this.status.value
    this.status.set(Status.VerticalBlank, false)
    this.scroll.resetLatch()
    this.address.resetLatch()
    return value
  }

  @inline
  renderingEnabled(): bool {
    return this.mask.get(Mask.ShowBackground) || this.mask.get(Mask.ShowSprites)
  }
}

export default Ppu
