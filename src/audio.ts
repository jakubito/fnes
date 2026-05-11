export class MappedAudioBuffer {
  constructor(
    private meta: Uint32Array,
    private buffer: Float32Array
  ) {}

  get readIndex() {
    return this.meta[0]
  }

  get writeIndex() {
    return this.meta[1]
  }

  get mask() {
    return this.meta[2]
  }

  incReadIndex() {
    this.meta[0] = (this.meta[0] + 1) & this.mask
  }

  samples() {
    return [...this]
  }

  *[Symbol.iterator]() {
    while (this.readIndex !== this.writeIndex) {
      const value = this.buffer[this.readIndex]
      this.incReadIndex()
      yield value
    }
  }
}
