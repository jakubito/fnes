import Mapper from '../mappers/Mapper'
import Mapper0 from '../mappers/Mapper0'
import Mapper2 from '../mappers/Mapper2'
import Mapper3 from '../mappers/Mapper3'
import { Mirroring } from '../ppu/enums'
import NesFile from './NesFile'

class Cartridge {
  mapper: Mapper

  constructor(fileBuffer: ArrayBuffer) {
    const file = new NesFile(fileBuffer)
    this.mapper = createMapper(file)
  }

  loadPrg(address: u16): u8 {
    switch (this.mapper.id) {
      case 0:
        return changetype<Mapper0>(this.mapper).loadPrg(address)
      case 2:
        return changetype<Mapper2>(this.mapper).loadPrg(address)
      case 3:
        return changetype<Mapper3>(this.mapper).loadPrg(address)
      default:
        return 0
    }
  }

  loadChr(address: u16): u8 {
    switch (this.mapper.id) {
      case 0:
        return changetype<Mapper0>(this.mapper).loadChr(address)
      case 2:
        return changetype<Mapper2>(this.mapper).loadChr(address)
      case 3:
        return changetype<Mapper3>(this.mapper).loadChr(address)
      default:
        return 0
    }
  }

  storePrg(address: u16, value: u8): void {
    switch (this.mapper.id) {
      case 0:
        changetype<Mapper0>(this.mapper).storePrg(address, value)
        break
      case 2:
        changetype<Mapper2>(this.mapper).storePrg(address, value)
        break
      case 3:
        changetype<Mapper3>(this.mapper).storePrg(address, value)
        break
    }
  }

  storeChr(address: u16, value: u8): void {
    switch (this.mapper.id) {
      case 0:
        changetype<Mapper0>(this.mapper).storeChr(address, value)
        break
      case 2:
        changetype<Mapper2>(this.mapper).storeChr(address, value)
        break
      case 3:
        changetype<Mapper3>(this.mapper).storeChr(address, value)
        break
    }
  }

  getMirroring(): Mirroring {
    return this.mapper.file.mirroring
  }
}

function createMapper(file: NesFile): Mapper {
  switch (file.mapper) {
    case 0:
      return new Mapper0(file)
    case 2:
      return new Mapper2(file)
    case 3:
      return new Mapper3(file)
    default:
      throw new Error('Unsupported mapper: ' + file.mapper.toString())
  }
}

export default Cartridge
