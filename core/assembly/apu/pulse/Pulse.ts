import Envelope from '../Envelope'
import { CHANNEL_LENGTH } from '../tables'
import Sequencer from './Sequencer'
import Sweep from './Sweep'

class Pulse {
  sequencer: Sequencer = new Sequencer()
  envelope: Envelope = new Envelope()
  sweep: Sweep
  enabled: bool = false
  timerParam: u16 = 0
  timer: u16 = 0
  length: u8 = 0

  constructor(public readonly id: u8) {
    this.sweep = new Sweep(id)
  }

  reset(): void {
    this.sequencer.reset()
    this.envelope.reset()
    this.sweep.reset()
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
    if (this.getStatus() && this.sequencer.output() && !this.sweep.isMuting()) {
      return this.envelope.getValue()
    }
    return 0
  }

  setDuty(value: u8): void {
    this.sequencer.setDuty(value >> 6)
    this.envelope.setup(value)
  }

  setTimerLo(value: u8): void {
    this.timerParam = (this.timerParam & 0xff00) | value
  }

  setTimerHi(value: u8): void {
    this.timerParam = (this.timerParam & 0xff) | (((<u16>value) & 0b111) << 8)
    this.timer = this.timerParam
    this.sweep.setTimer(this.timerParam)
    this.length = CHANNEL_LENGTH[(value & 0b1111_1000) >> 3]
    this.sequencer.restart()
    this.envelope.setStart()
  }

  tick(): void {
    if (this.getStatus()) {
      if (this.timer > 0) {
        this.timer--
      } else {
        this.timer = this.timerParam
        this.sequencer.advance()
      }
    }
  }

  tickCounter(): void {
    if (!this.envelope.loop && this.length > 0) {
      this.length--
    }
  }

  tickSweep(): void {
    if (this.sweep.tick()) {
      this.timerParam = this.sweep.target
      this.sweep.setTimer(this.timerParam)
    }
  }
}

export default Pulse
