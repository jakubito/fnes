import { Mirroring } from '../ppu/enums'
import Rom from './Rom'

class Drive {
  rom: Rom | null

  setRom(buffer: ArrayBuffer): void {
    this.rom = new Rom(buffer)
  }

  loadPrgRom(address: u16): u8 {
    if (this.rom == null) return 0
    if (address >= <u16>this.rom!.prgRom.length) return this.rom!.prgRom[address & 0x3fff]
    return this.rom!.prgRom[address]
  }

  loadChrRom(address: u16): u8 {
    if (this.rom == null) return 0
    return this.rom!.chrRom[address]
  }

  getMirroring(): Mirroring {
    if (this.rom == null) return 0
    return this.rom!.mirroring
  }
}

export default Drive
