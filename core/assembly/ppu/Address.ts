import { Register } from '../main'
import { Control } from './enums'

class Address {
  value: u16
  latch: bool

  constructor(private control: Register<Control>) {}

  update(byte: u8): void {
    this.value &= (<u16>0xff) << (<u8>this.latch * 8)
    this.value |= (<u16>byte) << ((1 - <u8>this.latch) * 8)
    this.value &= 0x3fff
    this.latch = !this.latch
  }

  increment(): void {
    const value: u8 = this.control.get(Control.VramIncrement) ? 32 : 1
    this.value += value
    this.value &= 0x3fff
  }

  resetLatch(): void {
    this.latch = false
  }
}

export default Address
