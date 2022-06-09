import { Drive } from '../drive'
import { Ppu } from '../ppu'
import { inRange } from '../common/helpers'
import { word } from './helpers'

class Bus {
  static WRAM_START: u16 = 0
  static WRAM_END: u16 = 0x1fff
  static PPU_CTRL: u16 = 0x2000
  static PPU_ADDR: u16 = 0x2006
  static PPU_DATA: u16 = 0x2007
  static PRG_START: u16 = 0x8000
  static PRG_END: u16 = 0xffff

  wram: Uint8Array = new Uint8Array(0x800)

  constructor(public drive: Drive, public ppu: Ppu) {}

  load(address: u16): u8 {
    if (inRange(address, Bus.WRAM_START, Bus.WRAM_END)) return this.loadWram(address)
    if (inRange(address, Bus.PRG_START, Bus.PRG_END)) return this.loadPrgRom(address)
    if (address == Bus.PPU_DATA) return this.ppu.loadAddress()
    throw new Error(`Cannot read from address 0x${address.toString(16)}`)
  }

  store(address: u16, value: u8): void {
    if (inRange(address, Bus.WRAM_START, Bus.WRAM_END)) return this.storeWram(address, value)
    if (address == Bus.PPU_ADDR) return this.ppu.updateAddress(value)
    if (address == Bus.PPU_DATA) return this.ppu.storeAddress(value)
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