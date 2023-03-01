import { Mirroring } from '../ppu/enums'
import { bit } from './helpers'

class NesFile {
  static TAG: StaticArray<u8> = [0x4e, 0x45, 0x53, 0x1a]
  static PRG_ROM_PAGE_SIZE: u16 = 0x4000
  static CHR_ROM_PAGE_SIZE: u16 = 0x2000

  prgRom: Uint8Array
  chrRom: Uint8Array
  mapper: u8
  mirroring: Mirroring

  constructor(public buffer: ArrayBuffer) {
    const header = Uint8Array.wrap(buffer, 0, 16)

    validateFormat(header)
    validateVersion(header)

    const prgSize = header[4] * NesFile.PRG_ROM_PAGE_SIZE
    const chrSize = header[5] * NesFile.CHR_ROM_PAGE_SIZE
    const start = bit(header[6], 2) * 512 + 16

    this.prgRom = Uint8Array.wrap(buffer, start, prgSize)
    this.chrRom = Uint8Array.wrap(buffer, start + prgSize, chrSize)
    this.mapper = getMapper(header)
    this.mirroring = getMirroring(header)
  }
}

// @ts-ignore
@inline
function validateFormat(header: Uint8Array): void {
  for (let i = 0; i < 4; i += 1) assert(header[i] == NesFile.TAG[i], 'Unknown rom format')
}

// @ts-ignore
@inline
function validateVersion(header: Uint8Array): void {
  const version = (header[7] >> 2) & 0b11
  assert(version == 0, 'Unsupported version')
}

// @ts-ignore
@inline
function getMapper(header: Uint8Array): u8 {
  return (header[7] & 0xf0) | (header[6] >> 4)
}

// @ts-ignore
@inline
function getMirroring(header: Uint8Array): Mirroring {
  if (bit(header[6], 3)) return Mirroring.FourScreen
  return bit(header[6], 0) ? Mirroring.Vertical : Mirroring.Horizontal
}

export default NesFile
