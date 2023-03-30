import NesFile from '../main/NesFile'
import { mirrorHorizontal, mirrorSingleScreen, mirrorVertical } from '../ppu/helpers'
import Mapper from './Mapper'

class Mapper1 extends Mapper {
  prgRam: Uint8Array = new Uint8Array(0x2000)
  chrRam: Uint8Array = new Uint8Array(0x2000)
  sr: u8 = 0b10000
  control: u8 = 0
  chrBank0: u8 = 0
  chrBank1: u8 = 0
  prgBank: u8 = 0
  lastPrgBank: u8 = 0
  usesChrRam: boolean

  constructor(file: NesFile) {
    super(file)
    this.lastPrgBank = <u8>(file.prgRom.length / NesFile.PRG_PAGE_SIZE) - 1
    this.usesChrRam = file.chrRom.length == 0
  }

  loadPrgRam(address: u16): u8 {
    return unchecked(this.prgRam[address & 0x1fff])
  }

  storePrgRam(address: u16, value: u8): void {
    unchecked((this.prgRam[address & 0x1fff] = value))
  }

  loadPrg(address: u16): u8 {
    const mode = (this.control >> 2) & 0b11
    const bank = (<u32>this.prgBank) & 0b1111
    let index = <u32>address

    switch (mode) {
      case 0:
      case 1:
        index &= 0x7fff
        index += (bank & ~1) * NesFile.PRG_PAGE_SIZE
        break
      case 2:
        index &= 0x3fff
        if (address >= 0xc000) index += bank * NesFile.PRG_PAGE_SIZE
        break
      case 3:
        index &= 0x3fff
        if (address >= 0xc000) index += <u32>this.lastPrgBank * NesFile.PRG_PAGE_SIZE
        else index += bank * NesFile.PRG_PAGE_SIZE
    }

    return unchecked(this.file.prgRom[index])
  }

  storePrg(address: u16, value: u8): void {
    if (value >> 7) {
      this.control |= 0b1100
      this.sr = 0b10000
      return
    }

    const full = this.sr & 1
    this.sr >>= 1
    this.sr |= (value & 1) << 4

    if (!full) return

    switch (address >> 12) {
      case 0x8:
      case 0x9:
        this.control = this.sr
        break
      case 0xa:
      case 0xb:
        this.chrBank0 = this.sr
        break
      case 0xc:
      case 0xd:
        this.chrBank1 = this.sr
        break
      case 0xe:
      case 0xf:
        this.prgBank = this.sr
    }

    this.sr = 0b10000
  }

  loadChr(address: u16): u8 {
    if (this.usesChrRam) return unchecked(this.chrRam[address])

    const mode = (this.control >> 4) & 1
    let index = <u32>address

    if (mode == 1 && address > 0xfff) {
      index &= 0xfff
      index += <u32>this.chrBank1 * NesFile.CHR_PAGE_SIZE
    } else {
      index += <u32>this.chrBank0 * NesFile.CHR_PAGE_SIZE
    }

    return unchecked(this.file.chrRom[index])
  }

  storeChr(address: u16, value: u8): void {
    if (this.usesChrRam) unchecked((this.chrRam[address] = value))
  }

  vramIndex(address: u16): u16 {
    const mirroring = this.control & 0b11
    switch (mirroring) {
      case 0:
      case 1:
        return mirrorSingleScreen(address, mirroring)
      case 2:
        return mirrorVertical(address)
      case 3:
        return mirrorHorizontal(address)
      default:
        return address
    }
  }
}

export default Mapper1
