import { Interrupt } from '../cpu/enums'
import { bit } from './helpers'

class Interrupts {
  pending: u8 = 0
  pendingIrq: u8 = 0
  irqDisabled: bool = false

  @inline
  reset(): void {
    this.pendingIrq = 0
    this.pending = 0
  }

  @inline
  poll(): u8 {
    if (this.pending) {
      for (let i: u8 = 1; i < 4; i++) {
        if (bit(this.pending, i)) {
          this.pending &= ~(1 << i)
          return i
        }
      }
    }
    if (this.pendingIrq && !this.irqDisabled) {
      return Interrupt.Irq
    }
    return 0
  }

  @inline
  trigger(interrupt: u8): void {
    this.pending |= 1 << interrupt
  }

  @inline
  triggerIrq(source: u8): void {
    this.pendingIrq |= 1 << source
  }

  @inline
  clearIrq(source: u8): void {
    this.pendingIrq &= ~(1 << source)
  }

  @inline
  enableIrq(): void {
    this.irqDisabled = false
  }

  @inline
  disableIrq(): void {
    this.irqDisabled = true
  }
}

export default Interrupts
