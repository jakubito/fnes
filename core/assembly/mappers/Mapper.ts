import NesFile from '../main/NesFile'
import { Mirroring } from '../ppu/enums'
import { mirrorHorizontal, mirrorVertical } from '../ppu/helpers'

abstract class Mapper {
  id: u8

  constructor(public file: NesFile) {
    this.id = file.mapper
  }

  abstract loadPrg(address: u16): u8
  abstract loadChr(address: u16): u8

  vramIndex(address: u16): u16 {
    switch (this.file.mirroring) {
      case Mirroring.Horizontal:
        return mirrorHorizontal(address)
      case Mirroring.Vertical:
        return mirrorVertical(address)
      default:
        return address
    }
  }
}

export default Mapper
