import { Register } from '../main'
import { Control } from './enums'
import Sprite from './Sprite'

class Oam {
  sprites: StaticArray<Sprite> = new StaticArray<Sprite>(64)
  lineSprites: StaticArray<Sprite | null> = new StaticArray<Sprite | null>(8)
  dot: u16 = 0
  dotSpriteIndex: u8 = 0
  data: Uint8Array = new Uint8Array(0x100)
  address: u8 = 0

  constructor(private control: Register<Control>) {
    for (let i: u8 = 0; i < 64; i++) this.sprites[i] = new Sprite()
  }

  @inline
  setAddress(address: u8): void {
    this.address = address
  }

  @inline
  load(): u8 {
    return unchecked(this.data[this.address])
  }

  @inline
  store(value: u8): void {
    unchecked((this.data[this.address] = value))
    if ((this.address & 0b11) == 3) this.updateSprite()
    this.address++
  }

  @inline
  updateSprite(): void {
    const spriteIndex = <u8>(this.address / 4)
    unchecked(this.sprites[spriteIndex]).update(this.data, spriteIndex)
  }

  @inline
  loadLine(line: u16): bool {
    const spriteHeight = <u8>this.control.get(Control.SpriteSize) * 8 + 8
    let count: u8 = 0
    for (let spriteIndex: u8 = 0; spriteIndex < 64; spriteIndex++) {
      if (line - unchecked(this.sprites[spriteIndex]).y >= spriteHeight) continue
      if (count == 8) return true
      unchecked((this.lineSprites[count] = unchecked(this.sprites[spriteIndex])))
      count++
    }
    return false
  }

  @inline
  setDot(dot: u16): void {
    this.dot = dot
    this.dotSpriteIndex = 0
  }

  @inline
  nextDotSprite(): Sprite | null {
    while (this.dotSpriteIndex < 8) {
      const sprite = unchecked(this.lineSprites[this.dotSpriteIndex])
      this.dotSpriteIndex++
      if (sprite == null) return null
      if (this.dot - sprite.x >= 8) continue
      return sprite
    }
    return null
  }

  @inline
  resetLine(): void {
    this.lineSprites.fill(null)
    this.address = 0
  }

  @inline
  resetSprites(): void {
    this.data.fill(0)
    for (let i: u8 = 0; i < 64; i++) unchecked(this.sprites[i]).reset()
  }

  reset(): void {
    this.resetLine()
    this.resetSprites()
  }
}

export default Oam
