import { bit } from '../../main/helpers'

class ShiftRegister {
  value: u16 = 1
  mode: bool = 0

  reset(): void {
    this.value = 1
    this.mode = 0
  }

  setMode(mode: bool): void {
    this.mode = mode
  }

  output(): bool {
    return (this.value & 1) == 0
  }

  shift(): void {
    const zeroBit: u16 = this.value & 1
    const otherBit: u16 = (this.value >> (this.mode ? 6 : 1)) & 1
    const newBit: u16 = zeroBit ^ otherBit
    this.value = (this.value >> 1) | (newBit << 14)
  }
}

export default ShiftRegister
