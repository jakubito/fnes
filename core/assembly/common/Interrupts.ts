import { Interrupt } from './enums'

class Interrupts {
  buffer: Interrupt[] = []

  empty(): bool {
    return this.buffer.length == 0
  }

  push(value: Interrupt): void {
    this.buffer.push(value)
  }

  shift(): Interrupt {
    return this.buffer.shift()
  }
}

export default Interrupts
