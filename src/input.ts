export enum Button {
  A,
  B,
  Select,
  Start,
  Up,
  Down,
  Left,
  Right,
}

type ButtonMap = Readonly<Record<Button, string>>

export const defaultButtonMap: ButtonMap = {
  [Button.A]: 'f',
  [Button.B]: 'd',
  [Button.Select]: 's',
  [Button.Start]: 'Enter',
  [Button.Up]: 'ArrowUp',
  [Button.Down]: 'ArrowDown',
  [Button.Left]: 'ArrowLeft',
  [Button.Right]: 'ArrowRight',
}

export class Input {
  playerOneButtons = new Uint8Array(8)
  playerTwoButtons = new Uint8Array(8)

  private _buttonMap!: ButtonMap
  private invertedButtonMap!: Record<string, Button>

  constructor() {
    this.buttonMap = defaultButtonMap
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  get buttonMap() {
    return this._buttonMap
  }

  set buttonMap(buttonMap: ButtonMap) {
    this._buttonMap = buttonMap
    this.invertedButtonMap = {}

    for (const entry of Object.entries(this.buttonMap)) {
      const [button, keyCode] = entry
      this.invertedButtonMap[keyCode] = Number(button) as Button
    }
  }

  pollGamepads() {
    const gamepads = <Gamepad[]>navigator.getGamepads().filter((gamepad) => {
      if (!gamepad?.connected) return false
      if (gamepad.mapping != 'standard') return false
      return true
    })

    if (gamepads[0]) this.pollGamepad(gamepads[0], this.playerOneButtons)
    if (gamepads[1]) this.pollGamepad(gamepads[1], this.playerTwoButtons)
  }

  dispose() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return
    const button = this.invertedButtonMap[event.key]
    if (button !== undefined) this.playerOneButtons[button] = 1
  }

  private onKeyUp = (event: KeyboardEvent) => {
    const button = this.invertedButtonMap[event.key]
    if (button !== undefined) this.playerOneButtons[button] = 0
  }

  private pollGamepad(gamepad: Gamepad, buffer: Uint8Array) {
    // https://www.w3.org/TR/gamepad/#dfn-standard-gamepad
    const { buttons } = gamepad
    buffer[0] = +buttons[1].pressed
    buffer[1] = +buttons[0].pressed | +buttons[2].pressed | +buttons[3].pressed
    buffer[2] = +buttons[8].pressed
    buffer[3] = +buttons[9].pressed
    buffer[4] = +buttons[12].pressed
    buffer[5] = +buttons[13].pressed
    buffer[6] = +buttons[14].pressed
    buffer[7] = +buttons[15].pressed
  }
}
