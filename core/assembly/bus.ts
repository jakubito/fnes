import { inRange, word } from './helpers'

class Bus {
  wram: Uint8Array = new Uint8Array(0x800)

  load(address: u16): u8 {
    if (inRange(address, 0x0, 0x1fff)) return this.loadWram(address)
    return 0
  }

  store(address: u16, value: u8): void {
    if (inRange(address, 0x0, 0x1fff)) this.storeWram(address, value)
  }

  loadWord(address: u16): u16 {
    return word(this.load(address), this.load(address + 1))
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
}

export default Bus
