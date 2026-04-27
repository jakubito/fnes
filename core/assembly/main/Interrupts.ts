import { Interrupt } from '../cpu/enums'
import { bit } from './helpers'

class Interrupts {
  pending: u8 = 0

  @inline
  poll(): Interrupt {
    if (this.pending > 0) {
      for (let i: u8 = 0; i < 3; i++) {
        if (bit(this.pending, i)) {
          this.pending &= ~(1 << i)
          return i
        }
      }
    }
    return Interrupt.Null
  }

  @inline
  trigger(interrupt: Interrupt): void {
    this.pending |= 1 << (<u8>interrupt)
  }

  @inline
  reset(): void {
    this.pending = 0
  }
}

export default Interrupts
