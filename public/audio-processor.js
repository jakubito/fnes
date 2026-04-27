class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.queue = []
    this.port.onmessage = (event) => {
      for (const sample of event.data) {
        this.queue.push(sample)
      }
    }
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0]
    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        const sample = this.queue.shift() ?? 0
        channel[i] = sample * 2 - 1
      }
    })
    return true
  }
}

registerProcessor('audio-processor', AudioProcessor)
