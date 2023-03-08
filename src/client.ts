import { __AdaptedExports } from '../core/build/core'

type CoreModule = typeof __AdaptedExports
type CoreInstance = ReturnType<typeof __AdaptedExports.createInstance>

enum Status {
  Ready,
  Stopped,
  Running,
}

enum Keymap {
  ArrowUp = 0x77,
  ArrowDown = 0x73,
  ArrowLeft = 0x61,
  ArrowRight = 0x64,
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
  private readonly frameBuffer: Uint8ClampedArray
  private readonly frameImageData: ImageData
  private readonly canvasElement: HTMLCanvasElement
  private readonly canvas: CanvasRenderingContext2D
  private _stop?: () => void

  private _status = Status.Ready
  private _volume = 50
  private _screenScale = 4

  constructor(module: CoreModule) {
    this.module = module
    this.instance = module.createInstance()
    // @ts-ignore
    const { buffer } = <WebAssembly.Memory>module.memory
    const frameBufferPointer = module.getFrameBufferPointer(this.instance)
    this.frameBuffer = new Uint8ClampedArray(buffer, frameBufferPointer, WIDTH * HEIGHT * 4)
    this.frameImageData = new ImageData(this.frameBuffer, WIDTH, HEIGHT)
    this.canvasElement = document.createElement('canvas')
    this.canvas = this.canvasElement.getContext('2d')!
    this.screenScale = this._screenScale
    this.volume = this._volume
    this.bindKeys()

    window.addEventListener('blur', this.stop)
    window.addEventListener('focus', this.start)
  }

  get timePerFrame() {
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
    this.canvasElement.style.width = `${scaledWidth}px`
    this.canvasElement.style.height = `${HEIGHT * scale}px`
    this.canvas.imageSmoothingEnabled = false
  }

  get volume() {
    return this._volume
  }

  set volume(value: number) {
    this._volume = value
  }

  start = () => {
    if (this._status === Status.Running) return

    const id = { value: 0 }
    let previousTime = performance.now()
    let timeAvailable = 0
    let frameReady = false

    const clientFrame = (time: DOMHighResTimeStamp) => {
      timeAvailable += Math.min(time - previousTime, 100)
      previousTime = time

      while (timeAvailable >= this.timePerFrame) {
        this.module.renderFrame(this.instance)
        timeAvailable -= this.timePerFrame
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

  stop = () => {
    this._stop?.()
  }

  appendCanvasTo(target: HTMLElement) {
    target.appendChild(this.canvasElement)
  }

  dispose() {
    this.stop()
    this.unbindKeys()
  }

  loadFile(buffer: ArrayBuffer) {
    this.module.loadFile(this.instance, buffer)
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (!Keymap.hasOwnProperty(event.code)) return
    if (event.repeat) return

    // const keyValue = Keymap[<keyof typeof Keymap>event.code]
    // TODO
  }

  private bindKeys() {
    document.addEventListener('keydown', this.onKeyDown)
  }

  private unbindKeys() {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}

export default Client
