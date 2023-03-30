import { Mapper, Mapper0, Mapper1, Mapper2, Mapper3, Mapper7 } from '../mappers'
import NesFile from './NesFile'

class Cartridge {
  mapper: Mapper

  constructor(fileBuffer: ArrayBuffer) {
    const file = new NesFile(fileBuffer)
    this.mapper = createMapper(file)
  }

  loadPrgRam(address: u16): u8 {
    switch (this.mapper.id) {
      case 1:
        return changetype<Mapper1>(this.mapper).loadPrgRam(address)
      default:
        return 0
    }
  }

  loadPrg(address: u16): u8 {
    switch (this.mapper.id) {
      case 0:
        return changetype<Mapper0>(this.mapper).loadPrg(address)
      case 1:
        return changetype<Mapper1>(this.mapper).loadPrg(address)
      case 2:
        return changetype<Mapper2>(this.mapper).loadPrg(address)
      case 3:
        return changetype<Mapper3>(this.mapper).loadPrg(address)
      case 7:
        return changetype<Mapper7>(this.mapper).loadPrg(address)
      default:
        return 0
    }
  }

  loadChr(address: u16): u8 {
    switch (this.mapper.id) {
      case 0:
        return changetype<Mapper0>(this.mapper).loadChr(address)
      case 1:
        return changetype<Mapper1>(this.mapper).loadChr(address)
      case 2:
        return changetype<Mapper2>(this.mapper).loadChr(address)
      case 3:
        return changetype<Mapper3>(this.mapper).loadChr(address)
      case 7:
        return changetype<Mapper7>(this.mapper).loadChr(address)
      default:
        return 0
    }
  }

  storePrgRam(address: u16, value: u8): void {
    switch (this.mapper.id) {
      case 1:
        changetype<Mapper1>(this.mapper).storePrgRam(address, value)
        break
    }
  }

  storePrg(address: u16, value: u8): void {
    switch (this.mapper.id) {
      case 1:
        changetype<Mapper1>(this.mapper).storePrg(address, value)
        break
      case 2:
        changetype<Mapper2>(this.mapper).storePrg(address, value)
        break
      case 3:
        changetype<Mapper3>(this.mapper).storePrg(address, value)
        break
      case 7:
        changetype<Mapper7>(this.mapper).storePrg(address, value)
        break
    }
  }

  storeChr(address: u16, value: u8): void {
    switch (this.mapper.id) {
      case 1:
        changetype<Mapper1>(this.mapper).storeChr(address, value)
        break
      case 2:
        changetype<Mapper2>(this.mapper).storeChr(address, value)
        break
      case 7:
        changetype<Mapper7>(this.mapper).storeChr(address, value)
        break
    }
  }

  vramIndex(address: u16): u16 {
    switch (this.mapper.id) {
      case 1:
        return changetype<Mapper1>(this.mapper).vramIndex(address)
      case 7:
        return changetype<Mapper7>(this.mapper).vramIndex(address)
      default:
        return this.mapper.vramIndex(address)
    }
  }
}

function createMapper(file: NesFile): Mapper {
  switch (file.mapper) {
    case 0:
      return new Mapper0(file)
    case 1:
      return new Mapper1(file)
    case 2:
      return new Mapper2(file)
    case 3:
      return new Mapper3(file)
    case 7:
      return new Mapper7(file)
    default:
      throw new Error('Unsupported mapper: ' + file.mapper.toString())
  }
}

export default Cartridge
