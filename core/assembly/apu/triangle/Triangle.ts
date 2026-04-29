import { bit } from '../../main/helpers'
import { LENGTH_TABLE } from '../shared'
import Sequencer from './Sequencer'

class Triangle {
  sequencer: Sequencer = new Sequencer()
  enabled: bool = false
  control: bool = false
  linearReload: bool = false
  timerParam: u16 = 0
  timer: u16 = 0
  linearParam: u8 = 0
  linear: u8 = 0
  length: u8 = 0

  reset(): void {
    this.sequencer.reset()
    this.enabled = false
    this.control = false
    this.linearReload = false
    this.timerParam = 0
    this.timer = 0
    this.linearParam = 0
    this.linear = 0
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

  isPlaying(): bool {
    return this.getStatus() && this.linear > 0
  }

  getValue(): u8 {
    if (this.isPlaying()) return this.sequencer.getValue()
    else return 0
  }

  setLinearCounter(value: u8): void {
    this.linearParam = value & 0b0111_1111
    this.control = <bool>bit(value, 7)
  }

  setTimerLo(value: u8): void {
    this.timerParam = (this.timerParam & 0xff00) | value
  }

  setTimerHi(value: u8): void {
    this.timerParam = (this.timerParam & 0xff) | (((<u16>value) & 0b111) << 8)
    this.timer = this.timerParam
    this.length = LENGTH_TABLE[(value & 0b1111_1000) >> 3]
    this.linearReload = true
  }

  tick(): void {
    if (this.isPlaying()) {
      if (this.timer > 0) {
        this.timer--
      } else {
        this.timer = this.timerParam
        this.sequencer.advance()
      }
    }
  }

  tickLinearCounter(): void {
    if (this.linearReload) {
      this.linear = this.linearParam
    } else if (this.control && this.linear > 0) {
      this.linear--
    }
    if (!this.control) {
      this.linearReload = false
    }
  }

  tickCounter(): void {
    if (!this.control && this.length > 0) {
      this.length--
    }
  }
}

export default Triangle
