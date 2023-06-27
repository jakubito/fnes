import { Drive, Inputs } from '../main'
import { Ppu } from '../ppu'
import { between } from '../main/helpers'
import { word } from './helpers'
import { ControllerAddress, PpuRegister } from './enums'

class Bus {
  wram: Uint8Array = new Uint8Array(0x800)

  constructor(private drive: Drive, private inputs: Inputs, private ppu: Ppu) {}

  reset(): void {
    this.wram.fill(0)
  }

  load(address: u16): u8 {
    switch (address) {
      case between(address, 0, 0x1fff):
        return this.loadWram(address)
      case PpuRegister.Status:
        return this.ppu.readStatus()
      case PpuRegister.OamData:
        return this.ppu.oam.load()
      case PpuRegister.Data:
        return this.ppu.loadFromAddress()
      case between(address, 0x2008, 0x3fff):
        return this.load(address & 0x2007)
      case ControllerAddress.PlayerOne:
        return this.inputs.playerOne.read()
      case ControllerAddress.PlayerTwo:
        return this.inputs.playerTwo.read()
      case between(address, 0x6000, 0x7fff):
        return this.drive.loadPrgRam(address)
      case between(address, 0x8000, 0xffff):
        return this.drive.loadPrg(address)
      default:
        return 0
    }
  }

  store(address: u16, value: u8): void {
    switch (address) {
      case between(address, 0, 0x1fff):
        return this.storeWram(address, value)
      case PpuRegister.Control:
        return this.ppu.setControl(value)
      case PpuRegister.Mask:
        return this.ppu.mask.setValue(value)
      case PpuRegister.OamAddress:
        return this.ppu.oam.setAddress(value)
      case PpuRegister.OamData:
        return this.ppu.oam.store(value)
      case PpuRegister.Scroll:
        return this.ppu.setScroll(value)
      case PpuRegister.Address:
        return this.ppu.setAddress(value)
      case PpuRegister.Data:
        return this.ppu.storeToAddress(value)
      case between(address, 0x2008, 0x3fff):
        return this.store(address & 0x2007, value)
      case PpuRegister.OamDma:
        return this.oamDmaTransfer(value)
      case ControllerAddress.PlayerOne:
        return this.inputs.setStrobe(value)
      case between(address, 0x6000, 0x7fff):
        return this.drive.storePrgRam(address, value)
      case between(address, 0x8000, 0xffff):
        return this.drive.storePrg(address, value)
    }
  }

  @inline
  loadWord(address: u16): u16 {
    const highByte = (address & 0xff00) | (<u8>(address & 0xff) + 1)
    return word(this.load(address), this.load(highByte))
  }

  @inline
  storeWord(address: u16, value: u16): void {
    this.store(address, <u8>(value & 0xff))
    this.store(address + 1, <u8>(value >> 8))
  }

  @inline
  tick(cycles: usize): void {
    this.ppu.run(cycles * 3)
  }

  @inline
  loadWram(address: u16): u8 {
    return unchecked(this.wram[address & 0x7ff])
  }

  @inline
  storeWram(address: u16, value: u8): void {
    unchecked((this.wram[address & 0x7ff] = value))
  }

  @inline
  oamDmaTransfer(highByte: u8): void {
    const startAddress = (<u16>highByte) << 8
    for (let i: u16 = 0; i < 0x100; i++) {
      this.ppu.oam.store(this.load(startAddress + i))
    }
  }
}

export default Bus
