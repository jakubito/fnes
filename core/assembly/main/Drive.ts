import Cartridge from './Cartridge'

class Drive {
  cartridge: Cartridge | null = null

  loadFile(buffer: ArrayBuffer): void {
    this.cartridge = new Cartridge(buffer)
  }

  @inline
  loadPrgRam(address: u16): u8 {
    return this.cartridge!.loadPrgRam(address)
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
  storePrgRam(address: u16, value: u8): void {
    this.cartridge!.storePrgRam(address, value)
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
  vramIndex(address: u16): u16 {
    return this.cartridge!.vramIndex(address)
  }
}

export default Drive
