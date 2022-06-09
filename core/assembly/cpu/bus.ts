import Drive from '../Drive'
import { Ppu } from '../ppu'
import { inRange, word } from '../helpers'

class Bus {
  wram: Uint8Array = new Uint8Array(0x800)

  constructor(public drive: Drive, public ppu: Ppu) {}

  load(address: u16): u8 {
    if (inRange(address, 0, 0x1fff)) return this.loadWram(address)
    if (inRange(address, 0x8000, 0xffff)) return this.loadPrgRom(address)
    if (address == 0x2007) return this.ppu.loadAddress()
    throw new Error(`Cannot read from address 0x${address.toString(16)}`)
  }

  store(address: u16, value: u8): void {
    if (inRange(address, 0, 0x1fff)) return this.storeWram(address, value)
    if (address == 0x2006) return this.ppu.updateAddress(value)
    if (address == 0x2007) return this.ppu.storeAddress(value)
    throw new Error(`Cannot write to address 0x${address.toString(16)}`)
  }

  loadWord(address: u16): u16 {
    const highByte = ((<u16>address) & 0xff00) | (<u8>(address & 0xff) + 1)
    return word(this.load(<u16>address), this.load(highByte))
  }

  storeWord(address: u16, value: u16): void {
    this.store(address, <u8>(value & 0xff))
    this.store(address + 1, <u8>(value >> 8))
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
    if (!this.drive.rom) return 0
    return this.drive.rom!.loadPrgRom(address & 0x7fff)
  }
}

export default Bus
