import NesFile from '../main/NesFile'
import { Mirroring } from '../ppu/enums'

abstract class Mapper {
  id: u8

  constructor(public file: NesFile) {
    this.id = file.mapper
  }

  abstract loadPrg(address: u16): u8
  abstract loadChr(address: u16): u8

  storePrg(address: u16, value: u8): void {}
  storeChr(address: u16, value: u8): void {}

  vramIndex(address: u16): u16 {
    const nametable = (address >> 10) & 0b11
    const mirroring = this.file.mirroring

    switch (nametable) {
      case 1:
        return address - (mirroring == Mirroring.Horizontal ? 0x400 : 0)
      case 2:
        return address - (mirroring == Mirroring.Vertical ? 0x800 : 0x400)
      case 3:
        return address - 0x800
      default:
        return address
    }
  }
}

export default Mapper
