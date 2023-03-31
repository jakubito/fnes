import { CoreInstance, CoreModule } from './types'

enum Status {
  Ready,
  Stopped,
  Running,
}

enum Keymap {
  KeyF,
  KeyD,
  KeyS,
  Enter,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
}

export enum DisplayMode {
  PixelPerfect = 1,
  Original = 8 / 7,
}

const WIDTH = 256
const HEIGHT = 240
const FRAME_TIME = 1000 / 60

class Client {
  private module: CoreModule
  readonly instance: CoreInstance

  private frameImageData!: ImageData
  private playerOneButtons!: Uint8Array
  private playerTwoButtons!: Uint8Array
  private readonly canvasElement: HTMLCanvasElement
  private readonly canvas: CanvasRenderingContext2D
  private _stop?: () => void

  private _status = Status.Ready
  private _volume = 50
  private _screenScale = 3
  private _speed = 1
  private _smoothingEnabled = true
  private _displayMode = DisplayMode.Original

  constructor(module: CoreModule) {
    this.module = module
    this.instance = module.createInstance()
    this.bindBuffers()
    this.canvasElement = document.createElement('canvas')
    this.canvas = this.canvasElement.getContext('2d')!
    this.screenScale = this._screenScale
    this.volume = this._volume
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('blur', this.stop)
  }

  get frameTime() {
    return FRAME_TIME / this.speed
  }

  get status() {
    return this._status
  }

  get screenScale() {
    return this._screenScale
  }

  set screenScale(scale: number) {
    const scaledWidth = Math.round(WIDTH * this.displayMode * scale)
    this._screenScale = scale
    this.canvasElement.width = scaledWidth * window.devicePixelRatio
    this.canvasElement.height = HEIGHT * scale * window.devicePixelRatio
    this.canvasElement.style.width = scaledWidth + 'px'
    this.canvasElement.style.height = HEIGHT * scale + 'px'
    this.drawFrame()
  }

  get volume() {
    return this._volume
  }

  set volume(value: number) {
    this._volume = value
  }

  get speed() {
    return this._speed
  }

  set speed(value: number) {
    this._speed = Math.min(Math.max(value, 0.1), 5)
  }

  get smoothingEnabled() {
    return this._smoothingEnabled
  }

  set smoothingEnabled(value: boolean) {
    this._smoothingEnabled = value
    this.drawFrame()
  }

  get displayMode() {
    return this._displayMode
  }

  set displayMode(value: DisplayMode) {
    this._displayMode = value
    this.screenScale = this._screenScale
  }

  bindBuffers() {
    const { buffer } = this.module.memory
    const frameBufferPointer = this.module.getFrameBufferPointer(this.instance)
    const playerOneBufferPointer = this.module.getPlayerOneBufferPointer(this.instance)
    const playerTwoBufferPointer = this.module.getPlayerTwoBufferPointer(this.instance)
    const frameBuffer = new Uint8ClampedArray(buffer, frameBufferPointer, WIDTH * HEIGHT * 4)
    this.frameImageData = new ImageData(frameBuffer, WIDTH, HEIGHT)
    this.playerOneButtons = new Uint8Array(buffer, playerOneBufferPointer, 8)
    this.playerTwoButtons = new Uint8Array(buffer, playerTwoBufferPointer, 8)
  }

  start = () => {
    if (!this.module.fileLoaded(this.instance)) return
    if (this._status === Status.Running) return

    const id = { value: 0 }
    let previousTime = performance.now()
    let timeAvailable = 0
    let frameReady = false

    const clientFrame = (time: DOMHighResTimeStamp) => {
      timeAvailable += Math.min(time - previousTime, 35)
      previousTime = time
      this.pollGamepads()

      while (timeAvailable >= this.frameTime) {
        this.module.renderFrame(this.instance)
        timeAvailable -= this.frameTime
        frameReady = true
      }

      if (frameReady) {
        this.drawFrame()
        frameReady = false
      }

      id.value = requestAnimationFrame(clientFrame)
    }

    this._stop = () => {
      cancelAnimationFrame(id.value)
      this._status = Status.Stopped
    }

    id.value = requestAnimationFrame(clientFrame)
    this._status = Status.Running
  }

  stop = () => {
    this._stop?.()
  }

  appendCanvasTo(target: HTMLElement) {
    target.appendChild(this.canvasElement)
  }

  drawFrame() {
    const { width, height } = this.canvasElement
    this.canvas.putImageData(this.frameImageData, 0, 0)
    this.canvas.imageSmoothingEnabled = false

    if (this.displayMode === DisplayMode.PixelPerfect) {
      this.canvas.drawImage(this.canvasElement, 0, 0, WIDTH, HEIGHT, 0, 0, width, height)
    } else {
      const scaledWidth = WIDTH * this._screenScale * window.devicePixelRatio
      this.canvas.drawImage(this.canvasElement, 0, 0, WIDTH, HEIGHT, 0, 0, scaledWidth, height)
      this.canvas.imageSmoothingEnabled = this.smoothingEnabled
      this.canvas.drawImage(this.canvasElement, 0, 0, scaledWidth, height, 0, 0, width, height)
    }
  }

  dispose() {
    this.stop()
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
    window.removeEventListener('blur', this.stop)
  }

  loadFile(buffer: ArrayBuffer) {
    this.module.__collect() // perform garbage collection before loading a new file
    this.module.loadFile(this.instance, buffer)
    this.bindBuffers()
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (!Keymap.hasOwnProperty(event.code)) return
    if (event.repeat) return
    const index = Keymap[<keyof typeof Keymap>event.code]
    this.playerOneButtons[index] = 1
  }

  onKeyUp = (event: KeyboardEvent) => {
    if (!Keymap.hasOwnProperty(event.code)) return
    const index = Keymap[<keyof typeof Keymap>event.code]
    this.playerOneButtons[index] = 0
  }

  pollGamepads() {
    const gamepads = <Gamepad[]>navigator.getGamepads().filter((gamepad) => {
      if (!gamepad?.connected) return false
      if (gamepad.mapping != 'standard') return false
      return true
    })
    if (gamepads[0]) this.pollStandardGamepad(gamepads[0], this.playerOneButtons)
    if (gamepads[1]) this.pollStandardGamepad(gamepads[1], this.playerTwoButtons)
  }

  pollStandardGamepad(gamepad: Gamepad, buffer: Uint8Array) {
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

export default Client
