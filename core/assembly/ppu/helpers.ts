// @ts-expect-error
@inline
export function mirrorHorizontal(address: u16): u16 {
  const nametable = (<u8>(address >> 10)) & 0b11
  switch (nametable) {
    case 1:
    case 2:
      return address - 0x400
    case 3:
      return address - 0x800
    default:
      return address
  }
}

// @ts-expect-error
@inline
export function mirrorVertical(address: u16): u16 {
  const nametable = (<u8>(address >> 10)) & 0b11
  switch (nametable) {
    case 2:
    case 3:
      return address - 0x800
    default:
      return address
  }
}

// @ts-expect-error
@inline
export function mirrorSingleScreen(address: u16, page: u8): u16 {
  return (address & 0x3ff) + <u16>page * 0x400
}

