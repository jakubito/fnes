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
  static PPU_MIRR_START: u16 = 0x2008
  static PPU_MIRR_END: u16 = 0x3fff
  static PRG_START: u16 = 0x8000
  static PRG_END: u16 = 0xffff

  wram: Uint8Array = new Uint8Array(0x800)

  constructor(public drive: Drive, public ppu: Ppu) {}

  load(address: u16): u8 {
    switch (address) {
      case inRange(address, Bus.WRAM_START, Bus.WRAM_END):
        return this.loadWram(address)
      case inRange(address, Bus.PRG_START, Bus.PRG_END):
        return this.loadPrgRom(address)
      case inRange(address, Bus.PPU_MIRR_START, Bus.PPU_MIRR_END):
        return this.load(address & Bus.PPU_DATA)
      case Bus.PPU_DATA:
        return this.ppu.loadAddress()
      default:
        throw new Error(`Cannot read from address 0x${address.toString(16)}`)
    }
  }

  store(address: u16, value: u8): void {
    switch (address) {
      case inRange(address, Bus.WRAM_START, Bus.WRAM_END):
        return this.storeWram(address, value)
      case inRange(address, Bus.PPU_MIRR_START, Bus.PPU_MIRR_END):
        return this.store(address & Bus.PPU_DATA, value)
      case Bus.PPU_CTRL:
        return this.ppu.updateControl(value)
      case Bus.PPU_ADDR:
        return this.ppu.updateAddress(value)
      case Bus.PPU_DATA:
        return this.ppu.storeAddress(value)
      default:
        throw new Error(`Cannot write to address 0x${address.toString(16)}`)
    }
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
