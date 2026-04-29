import { bit } from '../main/helpers'

class Envelope {
  param: u8 = 0
  divider: u8 = 0
  decay: u8 = 0
  start: bool = false
  loop: bool = false
  constVol: bool = false

  reset(): void {
    this.param = 0
    this.divider = 0
    this.decay = 0
    this.start = false
    this.loop = false
    this.constVol = false
  }

  setup(value: u8): void {
    this.loop = <bool>bit(value, 5)
    this.constVol = <bool>bit(value, 4)
    this.param = value & 0b1111
  }

  getValue(): u8 {
    if (this.constVol) return this.param
    return this.decay
  }

  setStart(): void {
    this.start = true
  }

  tick(): void {
    if (this.start) {
      this.start = false
      this.divider = this.param
      this.decay = 15
      return
    }

    if (this.divider > 0) {
      this.divider--
      return
    }

    this.divider = this.param

    if (this.decay > 0) {
      this.decay--
    } else if (this.loop) {
      this.decay = 15
    }
  }
}

export default Envelope
