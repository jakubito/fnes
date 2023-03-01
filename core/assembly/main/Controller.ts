class Controller {
  buttons: Uint8Array = new Uint8Array(8)
  snapshot: Uint8Array = new Uint8Array(8)
  index: u8

  read(): u8 {
    if (this.index == 8) return 1
    const value = this.snapshot[this.index]
    this.index++
    return value & 1
  }

  takeSnapshot(): void {
    this.snapshot = Uint8Array.wrap(this.buttons.buffer.slice())
    this.index = 0
  }
}

export default Controller
