import AudioBuffer from './AudioBuffer'

const SRC_RATE: f32 = 1789773.0
const TGT_RATE: f32 = 44300.0
const BUCKET_SIZE: f32 = SRC_RATE / TGT_RATE

class Resampler {
  output: AudioBuffer = new AudioBuffer(2048)
  sum: f32 = 0
  count: f32 = 0

  reset(): void {
    this.output.reset()
    this.sum = 0
    this.count = 0
  }

  put(value: f32): void {
    if (this.count + 1 > BUCKET_SIZE) {
      const rem: f32 = this.count + 1 - BUCKET_SIZE
      const com: f32 = 1 - rem
      const avg = (this.sum + value * com) / (this.count + com)
      this.output.put(avg)
      this.sum = value * rem
      this.count = rem
    } else {
      this.sum += value
      this.count++
    }
  }
}

export default Resampler
