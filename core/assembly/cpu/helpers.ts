// @ts-expect-error
@inline
export function word(lowByte: u8, highByte: u8): u16 {
  return ((<u16>highByte) << 8) | lowByte
}

// @ts-expect-error
@inline
export function pageCrossed(prev: u16, next: u16): bool {
  return prev >> 8 != next >> 8
}
