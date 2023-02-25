import { Drive } from '../main'
import { Ppu } from '../ppu'
import { between } from '../main/helpers'
import { word } from './helpers'

class Bus {
  wram: Uint8Array = new Uint8Array(0x800)

  constructor(private drive: Drive, private ppu: Ppu) {}

  load(address: u16): u8 {
    switch (address) {
      case between(address, 0, 0x1fff):
        return this.loadWram(address)
      case 0x2007:
        return this.ppu.loadAddress()
      case between(address, 0x2008, 0x3fff):
        return this.load(address & 0x2007)
      case between(address, 0x8000, 0xffff):
        return this.loadPrgRom(address)
      default:
        throw new Error(`Cannot read from address 0x${address.toString(16)}`)
    }
  }

  store(address: u16, value: u8): void {
    switch (address) {
      case between(address, 0, 0x1fff):
        return this.storeWram(address, value)
      case 0x2000:
        return this.ppu.updateControl(value)
      case 0x2006:
        return this.ppu.updateAddress(value)
      case 0x2007:
        return this.ppu.storeAddress(value)
      case between(address, 0x2008, 0x3fff):
        return this.store(address & 0x2007, value)
      default:
        throw new Error(`Cannot write to address 0x${address.toString(16)}`)
    }
  }

  loadWord(address: u16): u16 {
    const highByte = (address & 0xff00) | (<u8>(address & 0xff) + 1)
    return word(this.load(address), this.load(highByte))
  }

  storeWord(address: u16, value: u16): void {
    this.store(address, <u8>(value & 0xff))
    this.store(address + 1, <u8>(value >> 8))
  }

  tick(cycles: u8): void {
    this.ppu.run(cycles * 3)
  }

  @inline
  loadWram(address: u16): u8 {
    return this.wram[address & 0x7ff]
  }

  @inline
  storeWram(address: u16, value: u8): void {
    this.wram[address & 0x7ff] = value
  }

  @inline
  loadPrgRom(address: u16): u8 {
    return this.drive.loadPrgRom(address & 0x7fff)
  }
}

export default Bus
