import { bit } from '../../main/helpers'
import Envelope from '../Envelope'
import { CHANNEL_LENGTH, NOISE_TIMER } from '../tables'
import ShiftRegister from './ShiftRegister'

class Noise {
  shiftRegister: ShiftRegister = new ShiftRegister()
  envelope: Envelope = new Envelope()
  enabled: bool = false
  timerParam: u16 = 0
  timer: u16 = 0
  length: u8 = 0

  reset(): void {
    this.shiftRegister.reset()
    this.envelope.reset()
    this.enabled = false
    this.timerParam = 0
    this.timer = 0
    this.length = 0
  }

  enable(): void {
    this.enabled = true
  }

  disable(): void {
    this.enabled = false
    this.length = 0
  }

  getStatus(): bool {
    return this.enabled && this.length > 0
  }

  getValue(): u8 {
    if (this.getStatus() && this.shiftRegister.output()) {
      return this.envelope.getValue()
    }
    return 0
  }

  setTimer(value: u8): void {
    this.shiftRegister.setMode(<bool>bit(value, 7))
    this.timerParam = NOISE_TIMER[value & 0b1111]
  }

  setLength(value: u8): void {
    this.length = CHANNEL_LENGTH[(value & 0b1111_1000) >> 3]
    this.envelope.setStart()
  }

  tick(): void {
    if (this.getStatus()) {
      if (this.timer > 0) {
        this.timer--
      } else {
        this.timer = this.timerParam
        this.shiftRegister.shift()
      }
    }
  }

  tickCounter(): void {
    if (!this.envelope.loop && this.length > 0) {
      this.length--
    }
  }
}

export default Noise
