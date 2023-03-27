import Mapper from './Mapper'

class Mapper7 extends Mapper {
  chrRam: Uint8Array = new Uint8Array(0x2000)
  bank: u8 = 0
  vramPage: u8 = 0

  loadPrg(address: u16): u8 {
    const index = ((<u32>address) & 0x7fff) + <u32>this.bank * 0x8000
    return unchecked(this.file.prgRom[index])
  }

  storePrg(address: u16, value: u8): void {
    this.bank = value & 0b111
    this.vramPage = (value >> 4) & 1
  }

  loadChr(address: u16): u8 {
    return unchecked(this.chrRam[address])
  }

  storeChr(address: u16, value: u8): void {
    unchecked((this.chrRam[address] = value))
  }

  vramIndex(address: u16): u16 {
    return (address & 0x3ff) + <u16>this.vramPage * 0x400
  }
}

export default Mapper7
