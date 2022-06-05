import Rom from './rom'
import { inRange, word } from './helpers'

class Bus {
  wram: Uint8Array = new Uint8Array(0x800)
  rom: Rom | null

  setRom(buffer: ArrayBuffer): void {
    this.rom = new Rom(buffer)
  }

  load(address: u16): u8 {
    if (inRange(address, 0, 0x1fff)) return this.loadWram(address)
    if (inRange(address, 0x8000, 0xffff)) return this.loadPrgRom(address)
    return 0
  }

  store(address: u16, value: u8): void {
    if (inRange(address, 0, 0x1fff)) this.storeWram(address, value)
    if (inRange(address, 0x8000, 0xffff)) throw new Error('Read-only memory space')
  }

  loadWord(address: u16): u16 {
    const highByte = ((<u16>address) & 0xff00) | (<u8>(address & 0xff) + 1)
    return word(this.load(<u16>address), this.load(highByte))
  }

  storeWord(address: u16, value: u16): void {
    this.store(address, <u8>(value & 0xff))
    this.store(address + 1, <u8>(value >> 8))
  }

  loadWram(address: u16): u8 {
    return this.wram[address & 0x7ff]
  }

  storeWram(address: u16, value: u8): void {
    this.wram[address & 0x7ff] = value
  }

  loadPrgRom(address: u16): u8 {
    if (!this.rom) return 0
    return this.rom!.loadPrgRom(address & 0x7fff)
  }
}

export default Bus
