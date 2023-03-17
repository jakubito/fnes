import { __AdaptedExports } from '../core/build/core'

type CoreModule = typeof __AdaptedExports
type CoreInstance = ReturnType<typeof __AdaptedExports.createInstance>

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

enum DisplayMode {
  PixelPerfect = 1,
  Original = 8 / 7,
}

const WIDTH = 256
const HEIGHT = 240
const FRAME_TIME = 1000 / 60

class Client {
  private module: CoreModule
  readonly instance: CoreInstance

  private readonly speed = 1
  private readonly smoothingEnabled = true
  private readonly displayMode = DisplayMode.Original
  private frameImageData!: ImageData
  private playerOneButtons!: Uint8Array
  private readonly canvasElement: HTMLCanvasElement
  private readonly canvas: CanvasRenderingContext2D
  private _stop?: () => void

  private _status = Status.Ready
  private _volume = 50
  private _screenScale = 3

  constructor(module: CoreModule) {
    this.module = module
    this.instance = module.createInstance()
    this.canvasElement = document.createElement('canvas')
    this.canvas = this.canvasElement.getContext('2d')!
    this.screenScale = this._screenScale
    this.volume = this._volume
    this.bindBuffers()
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
  }

  get volume() {
    return this._volume
  }

  set volume(value: number) {
    this._volume = value
  }

  bindBuffers() {
    // @ts-ignore
    const { buffer } = <WebAssembly.Memory>this.module.memory
    const frameBufferPointer = this.module.getFrameBufferPointer(this.instance)
    const playerOneBufferPointer = this.module.getPlayerOneBufferPointer(this.instance)
    const frameBuffer = new Uint8ClampedArray(buffer, frameBufferPointer, WIDTH * HEIGHT * 4)
    this.frameImageData = new ImageData(frameBuffer, WIDTH, HEIGHT)
    this.playerOneButtons = new Uint8Array(buffer, playerOneBufferPointer, 8)
  }

  start = () => {
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
    const gamepads = navigator.getGamepads().filter((gamepad) => gamepad?.connected)
    if (gamepads[0]?.mapping == 'standard')
      this.pollStandardGamepad(gamepads[0], this.playerOneButtons)
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
