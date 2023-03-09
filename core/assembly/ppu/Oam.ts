import Sprite from './Sprite'

class Oam {
  sprites: StaticArray<Sprite> = new StaticArray<Sprite>(64)
  lineSprites: StaticArray<Sprite | null> = new StaticArray<Sprite | null>(8)
  dot: u16
  dotSpriteIndex: u8
  data: Uint8Array = new Uint8Array(0x100)
  address: u8

  constructor() {
    this.resetSprites()
  }

  @inline
  setAddress(address: u8): void {
    this.address = address
  }

  @inline
  load(): u8 {
    return this.data[this.address]
  }

  @inline
  store(value: u8): void {
    this.data[this.address] = value
    if (this.address % 4 == 3) this.updateSprite()
    this.address++
  }

  @inline
  updateSprite(): void {
    const spriteIndex = <u8>(this.address / 4)
    this.sprites[spriteIndex].update(this.data, spriteIndex)
  }

  @inline
  loadLine(line: u16): bool {
    let count: u8 = 0
    for (let spriteIndex: u8 = 0; spriteIndex < 64; spriteIndex++) {
      if (line - this.sprites[spriteIndex].y >= 8) continue
      if (count == 8) return true
      this.lineSprites[count] = this.sprites[spriteIndex]
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
      const sprite = this.lineSprites[this.dotSpriteIndex]
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
    for (let i: u8 = 0; i < 64; i++) this.sprites[i] = new Sprite()
  }

  reset(): void {
    this.resetLine()
    this.resetSprites()
  }
}

export default Oam
