import Character from '../ppu/Character'
import { Mirroring } from '../ppu/enums'
import NesFile from './NesFile'

class Drive {
  file: NesFile | null = null

  loadFile(buffer: ArrayBuffer): void {
    if (this.file) heap.free(changetype<usize>(this.file))
    this.file = new NesFile(buffer)
  }

  @inline
  loadPrgRom(address: u16): u8 {
    const prgRomSize = <u16>this.file!.prgRom.length
    if (address >= prgRomSize) return unchecked(this.file!.prgRom[address & 0x3fff])
    return unchecked(this.file!.prgRom[address])
  }

  @inline
  loadChrRom(address: u16): u8 {
    return unchecked(this.file!.chrRom[address])
  }

  @inline
  loadCharacter(index: u16): Character {
    return unchecked(this.file!.characters[index])
  }

  @inline
  getMirroring(): Mirroring {
    return this.file!.mirroring
  }
}

export default Drive
