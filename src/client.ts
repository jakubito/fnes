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

class Client {
  private module: CoreModule
  instance: CoreInstance

  private frameBuffer: Uint8ClampedArray
  private frameImageData: ImageData
  private canvas: HTMLCanvasElement
  private canvasContext: CanvasRenderingContext2D
  private _stop?: () => void

  private _status = Status.Ready
  private _volume = 50
  private _screenScale = 3
  private timePerFrame = 1000 / 60

  constructor(module: CoreModule) {
    this.module = module
    this.instance = module.createInstance()
    // @ts-ignore
    const { buffer } = <WebAssembly.Memory>module.memory
    const frameBufferPointer = module.getFrameBufferPointer(this.instance)
    this.frameBuffer = new Uint8ClampedArray(buffer, frameBufferPointer, 256 * 240 * 4)
    this.frameImageData = new ImageData(this.frameBuffer, 256, 240)
    this.canvas = document.createElement('canvas')
    this.canvasContext = this.canvas.getContext('2d')!
    this.screenScale = this._screenScale
    this.volume = this._volume
    this.bindKeys()

    window.addEventListener('blur', this.stop)
    window.addEventListener('focus', this.start)
  }

  get status() {
    return this._status
  }

  get screenScale() {
    return this._screenScale
  }

  set screenScale(scale: number) {
    this._screenScale = scale
    this.canvas.width = 256 * scale * window.devicePixelRatio
    this.canvas.height = 240 * scale * window.devicePixelRatio
    this.canvas.style.width = `${256 * scale}px`
    this.canvas.style.height = `${240 * scale}px`
    this.canvasContext.imageSmoothingEnabled = false
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
        const { width, height } = this.canvas
        this.canvasContext.putImageData(this.frameImageData, 0, 0)
        this.canvasContext.drawImage(this.canvas, 0, 0, 256, 240, 0, 0, width, height)
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
    target.appendChild(this.canvas)
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
