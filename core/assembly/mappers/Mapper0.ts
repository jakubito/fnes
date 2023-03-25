import NesFile from '../main/NesFile'
import Mapper from './Mapper'

class Mapper0 extends Mapper {
  prgMax: u16

  constructor(file: NesFile) {
    super(file)
    this.prgMax = <u16>file.prgRom.length - 1
  }

  loadPrg(address: u16): u8 {
    return unchecked(this.file.prgRom[address & this.prgMax])
  }

  loadChr(address: u16): u8 {
    return unchecked(this.file.chrRom[address])
  }
}

export default Mapper0
