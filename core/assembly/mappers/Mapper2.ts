import NesFile from '../main/NesFile'
import Mapper from './Mapper'

class Mapper2 extends Mapper {
  chrRam: Uint8Array = new Uint8Array(0x2000)
  bank: u8 = 0
  lastBank: u8 = 0

  constructor(file: NesFile) {
    super(file)
    this.lastBank = <u8>(file.prgRom.length / NesFile.PRG_ROM_PAGE_SIZE) - 1
  }

  loadPrg(address: u16): u8 {
    let index = (<u32>address) & 0x7fff

    if (index < NesFile.PRG_ROM_PAGE_SIZE) {
      index += <u32>this.bank * NesFile.PRG_ROM_PAGE_SIZE
    } else {
      index -= NesFile.PRG_ROM_PAGE_SIZE
      index += <u32>this.lastBank * NesFile.PRG_ROM_PAGE_SIZE
    }

    return unchecked(this.file.prgRom[index])
  }

  storePrg(address: u16, value: u8): void {
    this.bank = value
  }

  loadChr(address: u16): u8 {
    return unchecked(this.chrRam[address])
  }

  storeChr(address: u16, value: u8): void {
    unchecked((this.chrRam[address] = value))
  }
}

export default Mapper2
