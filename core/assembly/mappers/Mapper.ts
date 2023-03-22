import NesFile from '../main/NesFile'

@unmanaged
abstract class Mapper {
  constructor(public file: NesFile) {}

  abstract loadPrg(address: u16): u8
  abstract loadChr(address: u16): u8

  storePrg(address: u16, value: u8): void {}
  storeChr(address: u16, value: u8): void {}
}

export default Mapper
