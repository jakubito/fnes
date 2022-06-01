export function word(lowByte: u8, highByte: u8): u16 {
  return ((<u16>highByte) << 8) | lowByte
}

export function inRange(value: u16, start: u16, end: u16): bool {
  return value >= start && value <= end
}
