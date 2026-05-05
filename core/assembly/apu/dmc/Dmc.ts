import { Interrupts } from '../../main'
import { bit } from '../../main/helpers'
import Reader from './Reader'

const RATE_TIMER: StaticArray<u8> = [
  214, 190, 170, 160, 143, 127, 113, 107, 95, 80, 71, 64, 53, 42, 36, 27,
]

class Dmc {
  reader: Reader
  timerParam: u8 = 0
  timer: u8 = 0
  value: u8 = 0
  shiftRegister: u8 = 0
  bitsRemaining: u8 = 0
  silence: bool = true

  constructor(interrupts: Interrupts) {
    this.reader = new Reader(interrupts)
  }

  reset(): void {
    this.reader.reset()
    this.timerParam = 0
    this.timer = 0
    this.value = 0
    this.shiftRegister = 0
    this.bitsRemaining = 0
    this.silence = true
  }

  enable(): void {
    this.reader.restart()
  }

  disable(): void {
    this.reader.stop()
  }

  getStatus(): bool {
    return this.reader.length > 0
  }

  getValue(): u8 {
    return this.value
  }

  setValue(value: u8): void {
    this.value = value & 0b111_1111
  }

  setRate(value: u8): void {
    this.timerParam = RATE_TIMER[value & 0b1111]
    this.reader.setIrqEnable(<bool>bit(value, 7))
    this.reader.setLoop(<bool>bit(value, 6))
  }

  tick(): void {
    if (this.timer > 0) {
      this.timer--
      return
    }

    if (this.bitsRemaining == 0) {
      this.bitsRemaining = 8
      if (this.reader.bufferEmpty) {
        this.silence = true
      } else {
        this.silence = false
        this.shiftRegister = this.reader.takeBuffer()
      }
    }

    if (!this.silence) {
      if (this.shiftRegister & 1) {
        if (this.value < 126) this.value += 2
      } else {
        if (this.value > 1) this.value -= 2
      }
    }

    this.timer = this.timerParam
    this.shiftRegister >>= 1
    this.bitsRemaining--
  }
}

export default Dmc
