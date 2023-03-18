class Sprite {
  index: u8 = 0
  characterIndex: u8 = 0
  palette: u8 = 0
  priority: u8 = 0
  flipHorizontal: bool = false
  flipVertical: bool = false
  x: u8 = 0
  y: u8 = 0

  reset(): void {
    this.index = 0
    this.characterIndex = 0
    this.palette = 0
    this.priority = 0
    this.flipHorizontal = false
    this.flipVertical = false
    this.x = 0
    this.y = 0
  }

  update(oam: Uint8Array, index: u8): void {
    const address = index * 4
    const attributes = unchecked(oam[address + 2])
    this.index = index
    this.palette = attributes & 0b11
    this.priority = (attributes >> 5) & 1
    this.flipHorizontal = <bool>((attributes >> 6) & 1)
    this.flipVertical = <bool>((attributes >> 7) & 1)
    this.characterIndex = unchecked(oam[address + 1])
    this.x = unchecked(oam[address + 3])
    this.y = unchecked(oam[address])
  }
}

export default Sprite
