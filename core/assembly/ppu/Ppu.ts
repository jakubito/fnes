import { BitRegister } from '../common'
import { Interrupt } from '../common/enums'
import Address from './Address'
import Bus from './Bus'
import { Control } from './enums'

class Ppu {
  control: BitRegister = new BitRegister()
  address: Address = new Address()
  cycles: u8

  constructor(public bus: Bus) {}

  updateControl(value: u8): void {
    this.control.value = value
  }

  updateAddress(value: u8): void {
    this.address.update(value)
  }

  loadAddress(): u8 {
    const address = this.address.value
    this.address.increment(this.getControl(Control.VramIncrement) ? 32 : 1)
    return this.bus.load(address)
  }

  storeAddress(value: u8): void {
    this.bus.store(this.address.value, value)
  }

  getControl(bit: Control): bool {
    return this.control.get(<u8>bit)
  }

  setControl<T>(bit: Control, value: T): void {
    this.control.set(<u8>bit, value)
  }

  run(cycles: u8): void {
    for (let i: u8 = 0; i <= cycles; i++) this.step()
  }

  step(): void {
    // if (this.getControl(Control.GenerateNmi)) this.bus.interrupts.set(Interrupt.Nmi)
  }
}

export default Ppu
