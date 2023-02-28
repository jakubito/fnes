import { Interrupts, Register } from '../main'
import { Interrupt } from '../main/enums'
import Address from './Address'
import Scroll from './Scroll'
import Bus from './Bus'
import { Control, Mask, Status } from './enums'
import palette from './palette'

class Ppu {
  palette: StaticArray<StaticArray<u8>> = palette
  frameBuffer: Uint8Array = new Uint8Array(256 * 240 * 4)
  frameCount: usize
  control: Register<Control> = new Register<Control>()
  mask: Register<Mask> = new Register<Mask>()
  status: Register<Status> = new Register<Status>()
  address: Address = new Address(this.control)
  scroll: Scroll = new Scroll()
  oamAddress: u8
  line: u16
  dot: u16

  constructor(private bus: Bus, private interrupts: Interrupts) {
    this.reset()
  }

  reset(): void {
    this.frameCount = 0
    this.line = 0
    this.dot = 0
    this.oamAddress = 0
    this.control.reset()
    this.mask.reset()
    this.status.reset()
    this.address.reset()
    this.scroll.reset()
    this.frameBuffer.fill(0)
    for (let i = 3; i < this.frameBuffer.length; i += 4) this.frameBuffer[i] = 0xff
  }

  setControl(value: u8): void {
    const previousGenerateNmi = this.control.get(Control.GenerateNmi)
    this.control.setValue(value)
    this.handleControlNmiChange(previousGenerateNmi)
  }

  handleControlNmiChange(previousValue: bool): void {
    if (previousValue) return
    if (!this.control.get(Control.GenerateNmi)) return
    if (!this.status.get(Status.VerticalBlank)) return
    this.interrupts.trigger(Interrupt.Nmi)
  }

  loadFromAddress(): u8 {
    const address = this.address.value
    this.address.increment()
    return this.bus.load(address)
  }

  storeToAddress(value: u8): void {
    this.bus.store(this.address.value, value)
    this.address.increment()
  }

  setOamAddress(value: u8): void {
    this.oamAddress = value
  }

  loadFromOam(): u8 {
    return this.bus.load(this.oamAddress)
  }

  storeToOam(value: u8): void {
    this.bus.store(this.oamAddress, value)
    this.oamAddress++
  }

  readStatus(): u8 {
    const value = this.status.value
    this.status.set(Status.VerticalBlank, false)
    this.scroll.resetLatch()
    this.address.resetLatch()
    return value
  }

  run(cycles: usize): void {
    for (let i: usize = 0; i < cycles; i++) this.step()
  }

  step(): void {
    if (this.line == 241 && this.dot == 1 && this.control.get(Control.GenerateNmi)) {
      this.status.set(Status.VerticalBlank, true)
      this.interrupts.trigger(Interrupt.Nmi)
    }

    if (this.line == 261 && this.dot == 1) {
      this.status.set(Status.VerticalBlank, false)
    }

    this.dot++

    if (this.dot == 341) {
      this.dot = 0
      this.line++

      if (this.line == 262) {
        this.line = 0
        this.frameCount++
      }
    }
  }
}

export default Ppu
