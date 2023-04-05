export function cx(...entries: unknown[]) {
  return entries
    .flat()
    .filter((entry) => typeof entry === 'string')
    .join(' ')
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
