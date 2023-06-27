import { Drive } from '../main'
import { between } from '../main/helpers'

class Bus {
  vram: Uint8Array = new Uint8Array(0x800)
  palette: Uint8Array = new Uint8Array(0x20)
  readBuffer: u8 = 0

  constructor(public drive: Drive) {}

  reset(): void {
    this.vram.fill(0)
    this.palette.fill(0)
    this.readBuffer = 0
  }

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
    this.readBuffer = this.loadVramImmediate(address)
    return value
  }

  @inline
  loadVramImmediate(address: u16): u8 {
    const index = this.drive.vramIndex(address)
    return unchecked(this.vram[index])
  }

  @inline
  storeVram(address: u16, value: u8): void {
    const index = this.drive.vramIndex(address)
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
}

export default Bus
