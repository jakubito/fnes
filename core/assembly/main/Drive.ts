import { Mirroring } from '../ppu/enums'
import Cartridge from './Cartridge'

class Drive {
  cartridge: Cartridge | null = null

  loadFile(buffer: ArrayBuffer): void {
    this.cartridge = new Cartridge(buffer)
  }

  @inline
  loadPrg(address: u16): u8 {
    return this.cartridge!.loadPrg(address)
  }

  @inline
  loadChr(address: u16): u8 {
    return this.cartridge!.loadChr(address)
  }

  @inline
  storePrg(address: u16, value: u8): void {
    this.cartridge!.storePrg(address, value)
  }

  @inline
  storeChr(address: u16, value: u8): void {
    this.cartridge!.storeChr(address, value)
  }

  @inline
  getMirroring(): Mirroring {
    return this.cartridge!.getMirroring()
  }
}

export default Drive
