// @ts-ignore
@inline
export function between(value: u16, start: u16, end: u16): i32 {
  return value >= start && value <= end ? value : -1
}
