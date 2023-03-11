import { Drive } from '../main'
import { between } from '../main/helpers'
import { Mirroring } from './enums'
import Character from './Character'

class Bus {
  vram: Uint8Array = new Uint8Array(0x800)
  palette: Uint8Array = new Uint8Array(0x20)
  readBuffer: u8

  constructor(private drive: Drive) {}

  load(address: u16): u8 {
    switch (address) {
      case between(address, 0, 0x1fff):
        return this.loadChrRom(address)
      case between(address, 0x2000, 0x3eff):
        return this.loadVram(address)
      case 0x3f10:
      case 0x3f14:
      case 0x3f18:
      case 0x3f1c:
        return this.loadPalette(address - 0x10)
      case between(address, 0x3f00, 0x3f1f):
        return this.loadPalette(address)
      case between(address, 0x3f20, 0x3fff):
        return this.load(address & 0x3f1f)
      default:
        throw new Error(`Cannot read from PPU bus address 0x${address.toString(16)}`)
    }
  }

  store(address: u16, value: u8): void {
    switch (address) {
      case between(address, 0x2000, 0x3eff):
        return this.storeVram(address, value)
      case 0x3f10:
      case 0x3f14:
      case 0x3f18:
      case 0x3f1c:
        return this.storePalette(address - 0x10, value)
      case between(address, 0x3f00, 0x3f1f):
        return this.storePalette(address, value)
      case between(address, 0x3f20, 0x3fff):
        return this.store(address & 0x3f1f, value)
      default:
        throw new Error(`Cannot write to PPU bus address 0x${address.toString(16)}`)
    }
  }

  @inline
  loadChrRom(address: u16): u8 {
    const value = this.readBuffer
    this.readBuffer = this.drive.loadChrRom(address)
    return value
  }

  @inline
  loadVram(address: u16): u8 {
    const value = this.readBuffer
    const index = this.vramIndex(address)
    this.readBuffer = this.vram[index]
    return value
  }

  @inline
  storeVram(address: u16, value: u8): void {
    const index = this.vramIndex(address)
    this.vram[index] = value
  }

  @inline
  loadPalette(address: u16): u8 {
    return this.palette[address - 0x3f00]
  }

  @inline
  storePalette(address: u16, value: u8): void {
    this.palette[address - 0x3f00] = value
  }

  @inline
  loadCharacter(index: u8, page: u8): Character {
    return this.drive.loadCharacter(index + page * <u16>0x100)
  }

  vramIndex(address: u16): u16 {
    const index = (address % 0x3000) - 0x2000
    const nametable = <u8>(index / 0x400)
    const mirroring = this.drive.getMirroring()
    switch (nametable) {
      case 1:
        return index - (mirroring == Mirroring.Horizontal ? 0x400 : 0)
      case 2:
        return index - (mirroring == Mirroring.Vertical ? 0x800 : 0x400)
      case 3:
        return index - 0x800
      default:
        return index
    }
  }
}

export default Bus
