import NesFile from '../main/NesFile'

abstract class Mapper {
  id: u8

  constructor(public file: NesFile) {
    this.id = file.mapper
  }

  abstract loadPrg(address: u16): u8
  abstract loadChr(address: u16): u8

  storePrg(address: u16, value: u8): void {}
  storeChr(address: u16, value: u8): void {}
}

export default Mapper
