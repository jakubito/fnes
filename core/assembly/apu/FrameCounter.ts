import { Irq } from '../cpu/enums'
import { Interrupts } from '../main'
import { bit } from '../main/helpers'
import Channels from './Channels'

class FrameCounter {
  mode: bool = 0
  irqDisabled: bool = false
  irqTriggered: bool = false
  frameFinished: bool = false
  counter: u16 = 0
  queueSetup: u8 = 0
  queueDelay: i8 = -1

  constructor(
    private channels: Channels,
    private interrupts: Interrupts
  ) {}

  reset(): void {
    this.mode = 0
    this.irqDisabled = false
    this.irqTriggered = false
    this.frameFinished = false
    this.counter = 0
    this.queueSetup = 0
    this.queueDelay = -1
  }

  @inline
  clearIrq(): void {
    this.irqTriggered = false
    this.interrupts.clearIrq(Irq.Frame)
  }

  setup(value: u8, delay: u8): void {
    this.queueSetup = value
    this.queueDelay = delay
    if (bit(value, 6)) this.clearIrq()
  }

  tickQueue(): void {
    if (this.queueDelay < 0) return
    this.queueDelay--
    if (this.queueDelay == 0) {
      this.applySetup(this.queueSetup)
      this.queueDelay = -1
    }
  }

  applySetup(value: u8): void {
    this.counter = 0
    this.frameFinished = false
    this.mode = <bool>bit(value, 7)
    this.irqDisabled = <bool>bit(value, 6)
    if (this.mode) {
      this.tickQuarter()
      this.tickHalf()
    }
  }

  tick(): void {
    if (this.frameFinished) {
      this.counter = 0
      this.frameFinished = false
    }
    if (this.mode == 0) this.tickMode0()
    else this.tickMode1()
    this.counter++
  }

  @inline
  tickMode0(): void {
    switch (this.counter) {
      case 14914:
        if (!this.irqDisabled) {
          this.irqTriggered = true
          this.interrupts.triggerIrq(Irq.Frame)
        }
        this.frameFinished = true
      case 7456:
        this.tickHalf()
      case 11185:
      case 3728:
        this.tickQuarter()
    }
  }

  @inline
  tickMode1(): void {
    switch (this.counter) {
      case 18640:
        this.frameFinished = true
      case 7456:
        this.tickHalf()
      case 11185:
      case 3728:
        this.tickQuarter()
    }
  }

  tickQuarter(): void {
    this.channels.pulse1.envelope.tick()
    this.channels.pulse2.envelope.tick()
    this.channels.noise.envelope.tick()
    this.channels.triangle.tickLinearCounter()
  }

  tickHalf(): void {
    this.channels.pulse1.tickSweep()
    this.channels.pulse2.tickSweep()
    this.channels.pulse1.tickCounter()
    this.channels.pulse2.tickCounter()
    this.channels.triangle.tickCounter()
    this.channels.noise.tickCounter()
  }
}

export default FrameCounter
