enum Button {
  A,
  B,
  Select,
  Start,
  Up,
  Down,
  Left,
  Right,
}

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
    unchecked((this.snapshot[Button.A] = unchecked(this.buttons[Button.A])))
    unchecked((this.snapshot[Button.B] = unchecked(this.buttons[Button.B])))
    unchecked((this.snapshot[Button.Select] = unchecked(this.buttons[Button.Select])))
    unchecked((this.snapshot[Button.Start] = unchecked(this.buttons[Button.Start])))

    unchecked((this.snapshot[Button.Up] = 0))
    unchecked((this.snapshot[Button.Down] = 0))
    unchecked((this.snapshot[Button.Left] = 0))
    unchecked((this.snapshot[Button.Right] = 0))

    if (unchecked(this.buttons[Button.Up])) unchecked((this.snapshot[Button.Up] = 1))
    else if (unchecked(this.buttons[Button.Down])) unchecked((this.snapshot[Button.Down] = 1))

    if (unchecked(this.buttons[Button.Left])) unchecked((this.snapshot[Button.Left] = 1))
    else if (unchecked(this.buttons[Button.Right])) unchecked((this.snapshot[Button.Right] = 1))

    this.index = 0
  }
}

export default Controller
