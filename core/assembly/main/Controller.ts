class Controller {
  buttons: Uint8Array = new Uint8Array(8)
  snapshot: Uint8Array = new Uint8Array(8)
  strobe: bool = false
  index: u8 = 0

  read(): u8 {
    if (this.strobe) return this.buttons[0]
    if (this.index == 8) return 1
    const value = this.snapshot[this.index]
    this.index++
    return value & 1
  }

  setStrobe(strobe: bool): void {
    if (this.strobe && !strobe) this.takeSnapshot()
    this.strobe = strobe
  }

  @inline
  takeSnapshot(): void {
    unchecked((this.snapshot[0] = unchecked(this.buttons[0])))
    unchecked((this.snapshot[1] = unchecked(this.buttons[1])))
    unchecked((this.snapshot[2] = unchecked(this.buttons[2])))
    unchecked((this.snapshot[3] = unchecked(this.buttons[3])))
    unchecked((this.snapshot[4] = unchecked(this.buttons[4])))
    unchecked((this.snapshot[5] = unchecked(this.buttons[5])))
    unchecked((this.snapshot[6] = unchecked(this.buttons[6])))
    unchecked((this.snapshot[7] = unchecked(this.buttons[7])))
    this.index = 0
  }
}

export default Controller
