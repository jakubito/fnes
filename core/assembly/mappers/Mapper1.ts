import NesFile from '../main/NesFile'
import { mirrorHorizontal, mirrorSingleScreen, mirrorVertical } from '../ppu/helpers'
import Mapper from './Mapper'

class Mapper1 extends Mapper {
  static PRG_BANK: u16 = 0x4000
  static CHR_BANK: u16 = 0x1000
  prgRam: Uint8Array = new Uint8Array(0x2000)
  chrRam: Uint8Array = new Uint8Array(0x2000)
  sr: u8 = 0b10000
  control: u8 = 0b1100
  chrBank0: u8 = 0
  chrBank1: u8 = 0
  prgBank: u8 = 0
  lastPrgBank: u8 = 0
  usesChrRam: boolean

  constructor(file: NesFile) {
    super(file)
    this.lastPrgBank = <u8>(file.prgRom.length / Mapper1.PRG_BANK) - 1
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
    const bank = <u32>(this.prgBank & 0b1111)
    let index = <u32>address

    switch (mode) {
      case 0:
      case 1:
        index &= 0x7fff
        index += (bank & ~1) * Mapper1.PRG_BANK
        break
      case 2:
        index &= 0x3fff
        if (address >= 0xc000) index += bank * Mapper1.PRG_BANK
        break
      case 3:
        index &= 0x3fff
        if (address >= 0xc000) index += <u32>this.lastPrgBank * Mapper1.PRG_BANK
        else index += bank * Mapper1.PRG_BANK
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

    if (full) this.setRegister(address)
  }

  @inline
  setRegister(address: u16): void {
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
    if (this.usesChrRam) {
      const index = this.chrRamIndex(address)
      return unchecked(this.chrRam[index])
    }

    const index = this.chrRomIndex(address)
    return unchecked(this.file.chrRom[index])
  }

  @inline
  chrRomIndex(address: u16): u32 {
    const mask = this.chrBankMask()
    const mode = (this.control >> 4) & 1
    let index = <u32>address

    if (mode == 1) {
      if (address > 0xfff) {
        index &= 0xfff
        index += <u32>(this.chrBank1 & mask) * Mapper1.CHR_BANK
      } else {
        index += <u32>(this.chrBank0 & mask) * Mapper1.CHR_BANK
      }
    } else {
      index += <u32>(this.chrBank0 & mask & ~1) * Mapper1.CHR_BANK
    }

    return index
  }

  @inline
  chrBankMask(): u8 {
    switch (this.file.chrRom.length) {
      case 0x4000:
        return 0b11
      case 0x8000:
        return 0b111
      case 0x10000:
        return 0b1111
      case 0x20000:
        return 0b11111
      default:
        return 1
    }
  }

  storeChr(address: u16, value: u8): void {
    if (this.usesChrRam) {
      const index = this.chrRamIndex(address)
      unchecked((this.chrRam[index] = value))
    }
  }

  @inline
  chrRamIndex(address: u16): u16 {
    const mode = (this.control >> 4) & 1
    let index = address

    if (mode == 1) {
      if (address > 0xfff) {
        index &= 0xfff
        index += <u16>(this.chrBank1 & 1) * Mapper1.CHR_BANK
      } else {
        index += <u16>(this.chrBank0 & 1) * Mapper1.CHR_BANK
      }
    }

    return index
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
