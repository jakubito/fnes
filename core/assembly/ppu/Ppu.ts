import { Register } from '../main'
import { Interrupt } from '../main/enums'
import Address from './Address'
import Bus from './Bus'
import { Control, Mask, Status } from './enums'

class Ppu {
  control: Register<Control> = new Register<Control>()
  mask: Register<Mask> = new Register<Mask>()
  status: Register<Status> = new Register<Status>()
  address: Address = new Address()
  cycles: u8

  constructor(private bus: Bus) {}

  updateAddress(value: u8): void {
    this.address.update(value)
  }

  loadFromAddress(): u8 {
    const address = this.address.value
    this.address.increment(this.control.get(Control.VramIncrement) ? 32 : 1)
    return this.bus.load(address)
  }

  storeToAddress(value: u8): void {
    this.bus.store(this.address.value, value)
  }

  run(cycles: u8): void {
    for (let i: u8 = 0; i <= cycles; i++) this.step()
  }

  step(): void {
    // if (this.getControl(Control.GenerateNmi)) this.bus.interrupts.set(Interrupt.Nmi)
  }
}

export default Ppu
