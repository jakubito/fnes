import { Mirroring } from '../ppu/enums'
import NesFile from './NesFile'

class Drive {
  file: NesFile | null

  loadFile(buffer: ArrayBuffer): void {
    this.file = new NesFile(buffer)
  }

  @inline
  loadPrgRom(address: u16): u8 {
    if (this.file == null) return 0
    const prgRomSize = <u16>this.file!.prgRom.length
    if (address >= prgRomSize) return this.file!.prgRom[address & 0x3fff]
    return this.file!.prgRom[address]
  }

  @inline
  loadChrRom(address: u16): u8 {
    if (this.file == null) return 0
    return this.file!.chrRom[address]
  }

  @inline
  getMirroring(): Mirroring {
    if (this.file == null) return 0
    return this.file!.mirroring
  }
}

export default Drive
