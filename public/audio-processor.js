class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.queue = []
    this.last = 0.0
    this.port.onmessage = (event) => {
      for (const sample of event.data) {
        this.queue.push(sample)
      }
    }
  }

  process(inputs, outputs, parameters) {
    const channel = outputs[0][0]
    let sample

    for (let i = 0; i < channel.length; i++) {
      if (this.queue.length > 0) {
        sample = this.queue.shift()
      } else {
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

registerProcessor('audio-processor', AudioProcessor)
