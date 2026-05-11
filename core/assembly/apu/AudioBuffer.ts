class AudioBuffer {
  readonly meta: Uint32Array = new Uint32Array(3) // [readIndex, writeIndex, mask]
  readonly buffer: Float32Array

  /**
   * @param size Limited to powers of 2
   */
  constructor(size: u32) {
    this.buffer = new Float32Array(size)
    this.setMask(size - 1)
  }

  @inline
  get readIndex(): u32 {
    return this.meta[0]
  }

  @inline
  get writeIndex(): u32 {
    return this.meta[1]
  }

  @inline
  get mask(): u32 {
    return this.meta[2]
  }

  reset(): void {
    this.meta[0] = 0
    this.meta[1] = 0
  }

  put(value: f32): void {
    this.buffer[this.writeIndex] = value
    this.incWriteIndex()
    if (this.readIndex == this.writeIndex) this.incReadIndex()
  }

  @inline
  incReadIndex(): void {
    this.meta[0] = (this.meta[0] + 1) & this.mask
  }

  @inline
  incWriteIndex(): void {
    this.meta[1] = (this.meta[1] + 1) & this.mask
  }

  @inline
  setMask(value: u32): void {
    this.meta[2] = value
  }
}

export default AudioBuffer
