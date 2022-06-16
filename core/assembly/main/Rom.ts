import { Mirroring } from '../ppu/enums'

class Rom {
  static TAG: StaticArray<u8> = [0x4e, 0x45, 0x53, 0x1a]
  static PRG_PAGE_SIZE: u16 = 0x4000
  static CHR_PAGE_SIZE: u16 = 0x2000

  prgRom: Uint8Array
  chrRom: Uint8Array
  mapper: u8
  mirroring: Mirroring

  constructor(buffer: ArrayBuffer) {
    const header = Uint8Array.wrap(buffer, 0, 16)

    validateFormat(header)
    validateVersion(header)

    const prgSize = header[4] * Rom.PRG_PAGE_SIZE
    const chrSize = header[5] * Rom.CHR_PAGE_SIZE
    const start = ((header[6] >> 2) & 1) * 512 + 16

    this.prgRom = Uint8Array.wrap(buffer, start, prgSize)
    this.chrRom = Uint8Array.wrap(buffer, start + prgSize, chrSize)
    this.mapper = extractMapper(header)
    this.mirroring = extractMirroring(header)
  }
}

// @ts-ignore
@inline
function validateFormat(header: Uint8Array): void {
  for (let i = 0; i < 4; i += 1) assert(header[i] == Rom.TAG[i], 'Unknown rom format')
}

// @ts-ignore
@inline
function validateVersion(header: Uint8Array): void {
  const version = (header[7] >> 2) & 0b11
  assert(version == 0, 'Unsupported version')
}

// @ts-ignore
@inline
function extractMapper(header: Uint8Array): u8 {
  return (header[7] & 0xf0) | (header[6] >> 4)
}

// @ts-ignore
@inline
function extractMirroring(header: Uint8Array): Mirroring {
  if ((header[6] >> 3) & 1) return Mirroring.FourScreen
  return header[6] & 1 ? Mirroring.Vertical : Mirroring.Horizontal
}

export default Rom
