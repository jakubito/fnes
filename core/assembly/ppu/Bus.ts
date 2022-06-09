import { Drive } from '../drive'
import { inRange } from '../common/helpers'

class Bus {
  static CHR_START: u16 = 0
  static CHR_END: u16 = 0x1fff

  vram: Uint8Array = new Uint8Array(0x800)
  dataBuffer: u8

  constructor(public drive: Drive) {}

  load(address: u16): u8 {
    if (inRange(address, Bus.CHR_START, Bus.CHR_END)) return this.loadChrRom(address)
    throw new Error(`Cannot read from address 0x${address.toString(16)}`)
  }

  store(address: u16, value: u8): void {
    throw new Error(`Cannot write to address 0x${address.toString(16)}`)
  }

  @inline
  loadChrRom(address: u16): u8 {
    if (!this.drive.rom) return 0
    const value = this.dataBuffer
    this.dataBuffer = this.drive.rom!.loadChrRom(address)
    return value
  }
}

export default Bus
