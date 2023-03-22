import createMapper from '../mappers'
import Mapper from '../mappers/Mapper'
import Character from '../ppu/Character'
import { Mirroring } from '../ppu/enums'
import NesFile from './NesFile'

class Drive {
  mapper: Mapper | null = null

  loadFile(buffer: ArrayBuffer): void {
    if (this.mapper) heap.free(changetype<usize>(this.mapper))
    this.mapper = createMapper(new NesFile(buffer))
  }

  @inline
  loadPrg(address: u16): u8 {
    return this.mapper!.loadPrg(address)
  }

  @inline
  loadChr(address: u16): u8 {
    return this.mapper!.loadChr(address)
  }

  @inline
  storePrg(address: u16, value: u8): void {
    this.mapper!.storePrg(address, value)
  }

  @inline
  storeChr(address: u16, value: u8): void {
    this.mapper!.storePrg(address, value)
  }

  @inline
  loadCharacter(index: u16): Character {
    return unchecked(this.mapper!.file.characters[index])
  }

  @inline
  getMirroring(): Mirroring {
    return this.mapper!.file.mirroring
  }
}

export default Drive
