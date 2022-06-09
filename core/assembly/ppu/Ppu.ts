import { BitRegister } from '../common'
import Address from './Address'
import Bus from './Bus'
import { Control } from './enums'

class Ppu {
  control: BitRegister = new BitRegister()
  address: Address = new Address()

  constructor(public bus: Bus) {}

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
}

export default Ppu
