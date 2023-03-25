import { Drive } from '../main'
import { between } from '../main/helpers'
import { Mirroring } from './enums'

class Bus {
  vram: Uint8Array = new Uint8Array(0x800)
  palette: Uint8Array = new Uint8Array(0x20)
  readBuffer: u8 = 0

  constructor(public drive: Drive) {}

  load(address: u16): u8 {
    switch (address) {
      case between(address, 0, 0x1fff):
        return this.loadChr(address)
      case between(address, 0x2000, 0x2fff):
        return this.loadVram(address - 0x2000)
      case between(address, 0x3000, 0x3eff):
        return this.loadVram(address - 0x3000)
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
        return 0
    }
  }

  store(address: u16, value: u8): void {
    switch (address) {
      case between(address, 0, 0x1fff):
        return this.drive.storeChr(address, value)
      case between(address, 0x2000, 0x2fff):
        return this.storeVram(address - 0x2000, value)
      case between(address, 0x3000, 0x3eff):
        return this.storeVram(address - 0x3000, value)
      case 0x3f10:
      case 0x3f14:
      case 0x3f18:
      case 0x3f1c:
        return this.storePalette(address - 0x10, value)
      case between(address, 0x3f00, 0x3f1f):
        return this.storePalette(address, value)
      case between(address, 0x3f20, 0x3fff):
        return this.store(address & 0x3f1f, value)
    }
  }

  @inline
  loadChr(address: u16): u8 {
    const value = this.readBuffer
    this.readBuffer = this.drive.loadChr(address)
    return value
  }

  @inline
  loadVram(address: u16): u8 {
    const value = this.readBuffer
    const index = this.mirrorVram(address)
    this.readBuffer = unchecked(this.vram[index])
    return value
  }

  @inline
  storeVram(address: u16, value: u8): void {
    const index = this.mirrorVram(address)
    unchecked((this.vram[index] = value))
  }

  @inline
  loadPalette(address: u16): u8 {
    return unchecked(this.palette[address - 0x3f00])
  }

  @inline
  storePalette(address: u16, value: u8): void {
    unchecked((this.palette[address - 0x3f00] = value))
  }

  mirrorVram(address: u16): u16 {
    const nametable = (address >> 10) & 0b11
    const mirroring = this.drive.getMirroring()
    switch (nametable) {
      case 1:
        return address - (mirroring == Mirroring.Horizontal ? 0x400 : 0)
      case 2:
        return address - (mirroring == Mirroring.Vertical ? 0x800 : 0x400)
      case 3:
        return address - 0x800
      default:
        return address
    }
  }
}

export default Bus
