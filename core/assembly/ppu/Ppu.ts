import { Register } from '../main'
import { Interrupt } from '../main/enums'
import Address from './Address'
import Scroll from './Scroll'
import Bus from './Bus'
import { Control, Mask, Status } from './enums'
import palette from './palette'

class Ppu {
  palette: StaticArray<StaticArray<u8>> = palette
  control: Register<Control> = new Register<Control>()
  mask: Register<Mask> = new Register<Mask>()
  status: Register<Status> = new Register<Status>()
  address: Address = new Address(this.control)
  scroll: Scroll = new Scroll()
  oamAddress: u8
  scanline: u16
  position: u16
  frames: usize

  constructor(private bus: Bus) {}

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

  run(cycles: usize): void {
    for (let i: usize = 0; i < cycles; i++) this.step()
  }

  readStatus(): u8 {
    const value = this.status.value
    this.status.set(Status.VerticalBlank, false)
    this.scroll.resetLatch()
    this.address.resetLatch()
    return value
  }

  step(): void {
    // if (this.scanline == 0 && this.position == 0) {
    //   this.status.set(Status.VerticalBlank, false)
    //   this.status.set(Status.SpriteZeroHit, false)
    //   this.status.set(Status.SpriteOverflow, false)
    // }

    // if (this.scanline == 241 && this.position == 1) {
    //   this.status.set(Status.VerticalBlank, true)
    //   // if (this.getControl(Control.GenerateNmi)) this.bus.interrupts.set(Interrupt.Nmi)
    // }

    // if (this.scanline == 261 && this.position == 1) {
    //   this.evenFrame = !this.evenFrame
    //   this.scanline = 0
    //   this.position = 0
    //   return
    // }

    this.position++

    if (this.position == 341) {
      this.position = 0
      this.scanline++
    }

    if (this.scanline == 262) {
      this.position = 0
      this.scanline = 0
      this.frames++
    }
  }
}

export default Ppu
