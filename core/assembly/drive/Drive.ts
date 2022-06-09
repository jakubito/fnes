import Rom from './Rom'

class Drive {
  rom: Rom | null

  loadRom(buffer: ArrayBuffer): void {
    this.rom = new Rom(buffer)
  }
}

export default Drive
