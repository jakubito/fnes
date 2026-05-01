import { bit } from '../../main/helpers'

class Sweep {
  enabled: bool = false
  negate: bool = false
  reload: bool = false
  dividerParam: u8 = 0
  divider: u8 = 0
  shiftCount: u8 = 0
  timer: u16 = 0
  target: u16 = 0

  constructor(public readonly id: u8) {}

  reset(): void {
    this.enabled = false
    this.negate = false
    this.reload = false
    this.dividerParam = 0
    this.divider = 0
    this.shiftCount = 0
    this.timer = 0
    this.target = 0
  }

  setup(value: u8): void {
    this.enabled = <bool>bit(value, 7)
    this.negate = <bool>bit(value, 3)
    this.dividerParam = (value >> 4) & 0b111
    this.shiftCount = value & 0b111
    this.reload = true
    this.updateTarget()
  }

  setTimer(value: u16): void {
    this.timer = value
    this.updateTarget()
  }

  isMuting(): bool {
    if (this.timer < 8) return true
    if (this.enabled && this.shiftCount > 0 && this.target > 0x7ff) return true
    return false
  }

  updateTarget(): void {
    if (this.shiftCount > 0) {
      let change: i16 = this.timer >> this.shiftCount
      if (this.negate) {
        change *= -1
        if (this.id == 0) {
          change -= 1
        }
      }
      this.target = <u16>max(this.timer + change, 0)
    } else {
      this.target = this.timer
    }
  }

  tick(): bool {
    const shouldUpdate =
      this.divider == 0 && this.enabled && this.shiftCount > 0 && !this.isMuting()
    if (this.divider == 0 || this.reload) {
      this.divider = this.dividerParam
      this.reload = false
    } else {
      this.divider--
    }
    return shouldUpdate
  }
}

export default Sweep
