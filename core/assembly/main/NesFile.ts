import Character from '../ppu/Character'
import { Mirroring } from '../ppu/enums'
import { bit } from './helpers'

@unmanaged
class NesFile {
  static TAG: StaticArray<u8> = [0x4e, 0x45, 0x53, 0x1a]
  static PRG_ROM_PAGE_SIZE: u16 = 0x4000
  static CHR_ROM_PAGE_SIZE: u16 = 0x2000

  prgRom: Uint8Array
  chrRom: Uint8Array
  mapper: u8
  mirroring: Mirroring
  characters: StaticArray<Character>

  constructor(public buffer: ArrayBuffer) {
    const header = Uint8Array.wrap(buffer, 0, 16)

    validateFormat(header)
    validateVersion(header)

    const prgSize = <u32>header[4] * NesFile.PRG_ROM_PAGE_SIZE
    const chrSize = <u32>header[5] * NesFile.CHR_ROM_PAGE_SIZE

    const start = bit(header[6], 2) * 512 + 16
    const prgRom = Uint8Array.wrap(buffer, start, prgSize)
    const chrRom = Uint8Array.wrap(buffer, start + prgSize, chrSize)

    this.prgRom = prgRom
    this.chrRom = chrRom
    this.mapper = getMapper(header)
    this.mirroring = getMirroring(header)
    this.characters = buildCharacters(chrRom)
  }
}

function validateFormat(header: Uint8Array): void {
  for (let i = 0; i < 4; i++) {
    if (header[i] != NesFile.TAG[i]) throw new Error('Unknown rom format')
  }
}

function validateVersion(header: Uint8Array): void {
  const version = (header[7] >> 2) & 0b11
  if (version != 0) throw new Error('Unsupported rom version')
}

function getMapper(header: Uint8Array): u8 {
  return (header[7] & 0xf0) | (header[6] >> 4)
}

function getMirroring(header: Uint8Array): Mirroring {
  if (bit(header[6], 3)) return Mirroring.FourScreen
  return bit(header[6], 0) ? Mirroring.Vertical : Mirroring.Horizontal
}

function buildCharacters(chrRom: Uint8Array): StaticArray<Character> {
  const count = chrRom.length / 16
  const characters = new StaticArray<Character>(count)
  for (let i = 0; i < count; i++) characters[i] = new Character(chrRom, <u16>i * 16)
  return characters
}

export default NesFile
