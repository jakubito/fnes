import NesFile from '../main/NesFile'
import Mapper from './Mapper'

class Mapper3 extends Mapper {
  bank: u8 = 0
  prgMax: u16 = 0

  constructor(file: NesFile) {
    super(file)
    this.prgMax = <u16>file.prgRom.length - 1
  }

  loadPrg(address: u16): u8 {
    return unchecked(this.file.prgRom[address & this.prgMax])
  }

  storePrg(address: u16, value: u8): void {
    this.bank = value & 0b11
  }

  loadChr(address: u16): u8 {
    const index = <u32>address + <u32>this.bank * NesFile.CHR_PAGE_SIZE
    return unchecked(this.file.chrRom[index])
  }
}

export default Mapper3
