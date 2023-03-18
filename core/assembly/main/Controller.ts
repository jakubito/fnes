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
    this.snapshot[0] = this.buttons[0]
    this.snapshot[1] = this.buttons[1]
    this.snapshot[2] = this.buttons[2]
    this.snapshot[3] = this.buttons[3]
    this.snapshot[4] = this.buttons[4]
    this.snapshot[5] = this.buttons[5]
    this.snapshot[6] = this.buttons[6]
    this.snapshot[7] = this.buttons[7]
    this.index = 0
  }
}

export default Controller
