export class AudioBuffer {
  constructor(
    private meta: Uint32Array,
    private buffer: Float32Array
  ) {}

  *[Symbol.iterator]() {
    while (this.readIndex() !== this.writeIndex()) {
      const value = this.buffer[this.readIndex()]
      this.incReadIndex()
      yield value
    }
  }

  samples() {
    return [...this]
  }

  private readIndex() {
    return this.meta[0]
  }

  private writeIndex() {
    return this.meta[1]
  }

  private mask() {
    return this.meta[2]
  }

  private incReadIndex(): void {
    this.meta[0] = (this.meta[0] + 1) & this.mask()
  }
}
