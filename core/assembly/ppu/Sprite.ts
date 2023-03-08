class Sprite {
  spriteIndex: u8
  characterIndex: u8
  palette: u8
  priority: u8
  flipHorizontal: bool
  flipVertical: bool
  x: u8
  y: u8

  constructor(oam: Uint8Array, spriteIndex: u8) {
    const address = spriteIndex * 4
    const attributes = oam[address + 2]
    this.spriteIndex = spriteIndex
    this.palette = attributes & 0b11
    this.priority = (attributes >> 5) & 1
    this.flipHorizontal = <bool>((attributes >> 6) & 1)
    this.flipVertical = <bool>((attributes >> 7) & 1)
    this.characterIndex = oam[address + 1]
    this.x = oam[address + 3]
    this.y = oam[address]
  }
}

export default Sprite
