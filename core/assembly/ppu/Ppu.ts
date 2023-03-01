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
  oam: Uint8Array = new Uint8Array(0x100)
  oamAddress: u8
  line: u16
  dot: u16

  control: Register<Control> = new Register<Control>()
  mask: Register<Mask> = new Register<Mask>()
  status: Register<Status> = new Register<Status>()
  address: Address = new Address(this.control)
  scroll: Scroll = new Scroll()

  constructor(private bus: Bus, private interrupts: Interrupts) {
    this.reset()
  }

  reset(): void {
    this.frameCount = 0
    this.oamAddress = 0
    this.line = 0
    this.dot = 0
    this.control.reset()
    this.mask.reset()
    this.status.reset()
    this.address.reset()
    this.scroll.reset()
    this.oam.fill(0)
    this.frameBuffer.fill(0)
    for (let i = 3; i < this.frameBuffer.length; i += 4) this.frameBuffer[i] = 0xff
  }

  run(cycles: usize): void {
    for (let i: usize = 0; i < cycles; i++) this.step()
  }

  step(): void {
    // TODO handle BG + odd skip

    if (this.line < 240 && this.dot < 256) this.renderDot()

    if (this.line == 241 && this.dot == 1) {
      this.status.set(Status.VerticalBlank, true)
      if (this.control.get(Control.GenerateNmi)) this.interrupts.trigger(Interrupt.Nmi)
    }

    if (this.line == 261 && this.dot == 1) this.status.reset()

    this.advanceDot()
  }

  @inline
  renderDot(): void {
    // TODO
    // const x = this.dot
    // const y = this.line
    // const index = (y * 256 + x) * 4
    // const color = this.palette[0][0]
    // this.frameBuffer[index] = color
    // this.frameBuffer[index + 1] = color
    // this.frameBuffer[index + 2] = color
  }

  @inline
  advanceDot(): void {
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
    this.oam[this.oamAddress] = value
    this.oamAddress++
  }

  readStatus(): u8 {
    const value = this.status.value
    this.status.set(Status.VerticalBlank, false)
    this.scroll.resetLatch()
    this.address.resetLatch()
    return value
  }
}

export default Ppu
