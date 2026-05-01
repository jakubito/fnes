const DUTY_SEQUENCE: StaticArray<StaticArray<u8>> = [
  [0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 0],
  [1, 0, 0, 1, 1, 1, 1, 1],
]

class Sequencer {
  duty: u8 = 0
  index: u8 = 0

  reset(): void {
    this.duty = 0
    this.index = 0
  }

  restart(): void {
    this.index = 0
  }

  setDuty(value: u8): void {
    this.duty = value
  }

  output(): u8 {
    return DUTY_SEQUENCE[this.duty][this.index]
  }

  advance(): void {
    this.index++
    if (this.index > 7) {
      this.index = 0
    }
  }
}

export default Sequencer
