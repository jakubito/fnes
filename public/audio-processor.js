class AudioProcessor extends AudioWorkletProcessor {
  buffer = new CircularAudioBuffer(2048)
  last = 0

  constructor() {
    super()
    this.port.onmessage = (event) => {
      if (event.data.replace) {
        this.buffer.reset()
      }
      for (const sample of event.data.samples) {
        this.buffer.put(sample)
      }
    }
  }

  process(inputs, outputs, parameters) {
    const channel = outputs[0][0]
    let sample

    for (let i = 0; i < channel.length; i++) {
      sample = this.buffer.get()
      if (sample === null) {
        sample = this.last * 0.999
        if (Math.abs(sample) < 1e-5) sample = 0
      }
      sample = Math.max(Math.min(sample, 1), -1)
      this.last = sample
      channel[i] = sample
    }

    return true
  }
}

class CircularAudioBuffer {
  meta = new Uint32Array(3) // [readIndex, writeIndex, mask]

  /**
   * @param size Limited to powers of 2
   */
  constructor(size) {
    this.buffer = new Float32Array(size)
    this.setMask(size - 1)
  }

  get readIndex() {
    return this.meta[0]
  }

  get writeIndex() {
    return this.meta[1]
  }

  get mask() {
    return this.meta[2]
  }

  reset() {
    this.meta[0] = 0
    this.meta[1] = 0
  }

  put(value) {
    this.buffer[this.writeIndex] = value
    this.incWriteIndex()
    if (this.readIndex == this.writeIndex) this.incReadIndex()
  }

  get() {
    if (this.readIndex == this.writeIndex) return null
    const value = this.buffer[this.readIndex]
    this.incReadIndex()
    return value
  }

  incReadIndex() {
    this.meta[0] = (this.meta[0] + 1) & this.mask
  }

  incWriteIndex() {
    this.meta[1] = (this.meta[1] + 1) & this.mask
  }

  setMask(value) {
    this.meta[2] = value
  }
}

registerProcessor('audio-processor', AudioProcessor)
