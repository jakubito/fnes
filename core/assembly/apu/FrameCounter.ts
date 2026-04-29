import { Interrupt } from '../cpu/enums'
import { Interrupts } from '../main'
import { bit } from '../main/helpers'
import Channels from './Channels'

class FrameCounter {
  mode: bool = 0
  irqDisabled: bool = false
  frameFinished: bool = false
  counter: u16 = 0

  constructor(
    private channels: Channels,
    private interrupts: Interrupts
  ) {}

  reset(): void {
    this.mode = 0
    this.irqDisabled = false
    this.frameFinished = false
    this.counter = 0
  }

  setup(value: u8): void {
    this.mode = <bool>bit(value, 7)
    this.irqDisabled = <bool>bit(value, 6)
    this.counter = 0
    if (this.mode) {
      this.tickHalf()
      this.tickQuarter()
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
        if (!this.irqDisabled) this.interrupts.trigger(Interrupt.Irq)
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

  @inline
  tickQuarter(): void {
    this.channels.triangle.tickLinearCounter()
    this.channels.noise.envelope.tick()
  }

  @inline
  tickHalf(): void {
    this.channels.triangle.tickCounter()
    this.channels.noise.tickCounter()
  }
}

export default FrameCounter
