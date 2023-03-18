import { bit } from '../main/helpers'

class Character {
  private data: Uint8Array = new Uint8Array(64)

  constructor(chrRom: Uint8Array, address: u16) {
    for (let y = 0; y < 8; y++) {
      const lowByte = chrRom[address + y]
      const highByte = chrRom[address + y + 8]

      for (let x: u8 = 0; x < 8; x++) {
        const lowBit = bit(lowByte, 7 - x)
        const highBit = bit(highByte, 7 - x) << 1
        unchecked((this.data[y * 8 + x] = lowBit | highBit))
      }
    }
  }

  getPixel(x: u8, y: u8): u8 {
    return unchecked(this.data[y * 8 + x])
  }
}

export default Character
