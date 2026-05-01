const SEQUENCE: StaticArray<u8> = [
  15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  13, 14, 15,
]

class Sequencer {
  index: u8 = 0

  reset(): void {
    this.index = 0
  }

  output(): u8 {
    return SEQUENCE[this.index]
  }

  advance(): void {
    this.index++
    if (this.index > 31) {
      this.index = 0
    }
  }
}

export default Sequencer
