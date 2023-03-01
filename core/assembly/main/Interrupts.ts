import { Interrupt } from './enums'

class Interrupts {
  value: StaticArray<bool> = new StaticArray(3)

  poll(): Interrupt {
    for (let i: i32 = 0; i < this.value.length; i++) {
      if (!this.value[i]) continue
      this.value[i] = false
      return i
    }

    return -1
  }

  trigger(interrupt: Interrupt): void {
    this.value[interrupt] = true
  }

  reset(): void {
    this.value.fill(false)
  }
}

export default Interrupts
