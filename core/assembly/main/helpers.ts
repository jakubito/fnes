// @ts-expect-error "decorators are not valid here"
@inline
export function between(start: u16, end: u16, value: u16): i32 {
  return value >= start && value <= end ? value : -1
}

// @ts-expect-error
@inline
export function bit(value: u8, position: u8): u8 {
  return (value >> position) & 1
}
