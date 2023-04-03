import { Interrupt } from '../cpu/enums'

class Interrupts {
  value: StaticArray<bool> = new StaticArray(3)

  poll(): Interrupt {
    if (this.value[Interrupt.Nmi]) {
      unchecked((this.value[Interrupt.Nmi] = false))
      return Interrupt.Nmi
    }

    if (this.value[Interrupt.Reset]) {
      unchecked((this.value[Interrupt.Reset] = false))
      return Interrupt.Reset
    }

    if (this.value[Interrupt.Irq]) {
      unchecked((this.value[Interrupt.Irq] = false))
      return Interrupt.Irq
    }

    return Interrupt.Null
  }

  trigger(interrupt: Interrupt): void {
    unchecked((this.value[interrupt] = true))
  }

  reset(): void {
    this.value.fill(false)
  }
}

export default Interrupts
