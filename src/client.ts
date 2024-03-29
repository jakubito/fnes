import { CoreInstance, CoreModule } from './types'
import { Input } from './input'

export enum Status {
  Ready,
  Stopped,
  Running,
}

export enum DisplayMode {
  PixelPerfect,
  Original,
}

const aspectRatio: Readonly<Record<DisplayMode, number>> = {
  [DisplayMode.PixelPerfect]: 1,
  [DisplayMode.Original]: 8 / 7,
}

export class Client {
  onStatusChange?: (status: Status) => void
  readonly input = new Input()

  private readonly module: CoreModule
  private readonly instance: CoreInstance

  private fileLoaded = false
  private frameImageData!: ImageData
  private readonly canvasElement: HTMLCanvasElement
  private readonly canvas: CanvasRenderingContext2D

  private _stop?: () => void
  private _status = Status.Ready
  private _volume = 50
  private _screenScale = 2
  private _speed = 1
  private _imageSmoothing = true
  private _displayMode = DisplayMode.Original

  constructor(module: CoreModule) {
    this.module = module
    this.instance = module.createInstance()
    this.bindBuffers()
    this.canvasElement = document.createElement('canvas')
    this.canvas = this.canvasElement.getContext('2d')!
    this.screenScale = this._screenScale
    this.volume = this._volume
  }

  get status() {
    return this._status
  }

  get screenScale() {
    return this._screenScale
  }

  set screenScale(value: number) {
    const width = Math.round(256 * aspectRatio[this.displayMode] * value)
    this._screenScale = value
    this.resizeCanvas(width, 240 * value)
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
    this._speed = value
  }

  get imageSmoothing() {
    return this._imageSmoothing
  }

  set imageSmoothing(value: boolean) {
    this._imageSmoothing = value
    this.drawFrame()
  }

  get displayMode() {
    return this._displayMode
  }

  set displayMode(value: DisplayMode) {
    this._displayMode = value
    this.screenScale = this._screenScale
  }

  private get frameTime() {
    return 1000 / 60 / this.speed
  }

  appendCanvasTo(target: HTMLElement) {
    target.appendChild(this.canvasElement)
  }

  resizeCanvasByWidth(width: number) {
    const height = Math.round(width / ((256 / 240) * aspectRatio[this.displayMode]))
    this.resizeCanvas(width, height)
  }

  resizeCanvasByHeight(height: number) {
    const width = Math.round(height * (256 / 240) * aspectRatio[this.displayMode])
    this.resizeCanvas(width, height)
  }

  loadFile(buffer: ArrayBuffer) {
    this.module.__collect() // perform garbage collection before loading a new file
    this.module.loadFile(this.instance, buffer)
    this.bindBuffers()
    this.fileLoaded = true
  }

  start() {
    if (!this.fileLoaded) return
    if (this._status === Status.Running) return

    const id = { value: 0 }
    let previousTime = performance.now()
    let timeAvailable = 0
    let frameReady = false

    const clientFrame = (time: DOMHighResTimeStamp) => {
      timeAvailable += Math.min(time - previousTime, 35)
      previousTime = time
      this.input.pollGamepads()

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
      this.onStatusChange?.(this.status)
    }

    id.value = requestAnimationFrame(clientFrame)
    this._status = Status.Running
    this.onStatusChange?.(this.status)
  }

  stop() {
    this._stop?.()
  }

  reset() {
    if (!this.fileLoaded) return
    this.stop()
    this.module.reset(this.instance)
    this.start()
  }

  dispose() {
    this.stop()
    this.input.dispose()
  }

  private bindBuffers() {
    const { buffer } = this.module.memory
    const frameBufferPointer = this.module.getFrameBufferPointer(this.instance)
    const playerOneBufferPointer = this.module.getPlayerOneBufferPointer(this.instance)
    const playerTwoBufferPointer = this.module.getPlayerTwoBufferPointer(this.instance)
    const frameBuffer = new Uint8ClampedArray(buffer, frameBufferPointer, 256 * 240 * 4)
    this.frameImageData = new ImageData(frameBuffer, 256, 240)
    this.input.playerOneButtons = new Uint8Array(buffer, playerOneBufferPointer, 8)
    this.input.playerTwoButtons = new Uint8Array(buffer, playerTwoBufferPointer, 8)
  }

  private resizeCanvas(width: number, height: number) {
    this.canvasElement.width = width * window.devicePixelRatio
    this.canvasElement.height = height * window.devicePixelRatio
    this.canvasElement.style.width = width + 'px'
    this.canvasElement.style.height = height + 'px'
    this.drawFrame()
  }

  private drawFrame() {
    const { width, height } = this.canvasElement
    this.canvas.putImageData(this.frameImageData, 0, 0)
    this.canvas.imageSmoothingEnabled = false

    if (this.displayMode === DisplayMode.PixelPerfect) {
      this.canvas.drawImage(this.canvasElement, 0, 0, 256, 240, 0, 0, width, height)
    } else {
      const scaledWidth = 256 * this._screenScale * window.devicePixelRatio
      this.canvas.drawImage(this.canvasElement, 0, 0, 256, 240, 0, 0, scaledWidth, height)
      this.canvas.imageSmoothingEnabled = this.imageSmoothing
      this.canvas.drawImage(this.canvasElement, 0, 0, scaledWidth, height, 0, 0, width, height)
    }
  }
}
