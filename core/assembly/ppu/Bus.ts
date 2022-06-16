import { Drive, Interrupts } from '../main'
import { inRange } from '../main/helpers'
import { Mirroring } from './enums'

class Bus {
  vram: Uint8Array = new Uint8Array(0x800)
  palette: Uint8Array = new Uint8Array(0x20)
  dataBuffer: u8

  constructor(public drive: Drive, public interrupts: Interrupts) {}

  load(address: u16): u8 {
    switch (address) {
      case inRange(address, 0, 0x1fff):
        return this.loadChrRom(address)
      case inRange(address, 0x2000, 0x3eff):
        return this.loadVram(address)
      case 0x3f10:
      case 0x3f14:
      case 0x3f18:
      case 0x3f1c:
        return this.loadPalette(address - 0x10)
      case inRange(address, 0x3f00, 0x3f1f):
        return this.loadPalette(address)
      case inRange(address, 0x3f20, 0x3fff):
        return this.load(address & 0x3f1f)
      default:
        throw new Error(`Cannot read from address 0x${address.toString(16)}`)
    }
  }

  store(address: u16, value: u8): void {
    switch (address) {
      case inRange(address, 0x2000, 0x3eff):
        return this.storeVram(address, value)
      case 0x3f10:
      case 0x3f14:
      case 0x3f18:
      case 0x3f1c:
        return this.storePalette(address - 0x10, value)
      case inRange(address, 0x3f00, 0x3f1f):
        return this.storePalette(address, value)
      case inRange(address, 0x3f20, 0x3fff):
        return this.store(address & 0x3f1f, value)
      default:
        throw new Error(`Cannot write to address 0x${address.toString(16)}`)
    }
  }

  @inline
  loadChrRom(address: u16): u8 {
    const value = this.dataBuffer
    this.dataBuffer = this.drive.loadChrRom(address)
    return value
  }

  @inline
  loadVram(address: u16): u8 {
    const index = this.getVramIndex(address)
    const value = this.dataBuffer
    this.dataBuffer = this.vram[index]
    return value
  }

  @inline
  storeVram(address: u16, value: u8): void {
    const index = this.getVramIndex(address)
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

  getVramIndex(address: u16): u16 {
    const index = (address & 0x2fff) - 0x2000
    const nametable = index / 0x400
    const mirroring = this.drive.getMirroring()
    switch (nametable) {
      case 1:
        if (mirroring == Mirroring.Horizontal) return index - 0x400
        return index
      case 2:
        if (mirroring == Mirroring.Vertical) return index - 0x800
        return index - 0x400
      case 3:
        return index - 0x800
      default:
        return index
    }
  }
}

export default Bus
