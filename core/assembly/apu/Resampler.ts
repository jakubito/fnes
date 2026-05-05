import AudioBuffer from './AudioBuffer'

const SRC_RATE: f32 = 1789773.0
const TGT_RATE: f32 = 44100.0
const STEP: f32 = SRC_RATE / TGT_RATE
const LP_CUTOFF: f32 = 13000.0
const LP_Q: f32 = 0.70710677 // Butterworth

class Resampler {
  output: AudioBuffer = new AudioBuffer(2048)
  phase: f32 = 0
  prev: f32 = 0
  prevSet: bool = false

  // Biquad coefficients (a0 normalized to 1)
  b0: f32 = 0
  b1: f32 = 0
  b2: f32 = 0
  a1: f32 = 0
  a2: f32 = 0

  // Biquad state (Direct Form II Transposed)
  z1: f32 = 0
  z2: f32 = 0

  constructor() {
    const w0: f32 = (2.0 * Mathf.PI * LP_CUTOFF) / SRC_RATE
    const cw: f32 = Mathf.cos(w0)
    const sw: f32 = Mathf.sin(w0)
    const alpha: f32 = sw / (2.0 * LP_Q)

    // RBJ low-pass biquad
    const rb0: f32 = (1.0 - cw) * 0.5
    const rb1: f32 = 1.0 - cw
    const rb2: f32 = (1.0 - cw) * 0.5
    const ra0: f32 = 1.0 + alpha
    const ra1: f32 = -2.0 * cw
    const ra2: f32 = 1.0 - alpha

    this.b0 = rb0 / ra0
    this.b1 = rb1 / ra0
    this.b2 = rb2 / ra0
    this.a1 = ra1 / ra0
    this.a2 = ra2 / ra0
  }

  reset(): void {
    this.output.reset()
    this.phase = 0
    this.prev = 0
    this.prevSet = false
    this.z1 = 0
    this.z2 = 0
  }

  @inline
  private lowPass(x: f32): f32 {
    const y: f32 = this.b0 * x + this.z1
    this.z1 = this.b1 * x - this.a1 * y + this.z2
    this.z2 = this.b2 * x - this.a2 * y
    return y
  }

  put(value: f32): void {
    const filtered: f32 = this.lowPass(value)
    if (!this.prevSet) {
      this.prev = filtered
      this.prevSet = true
      return
    }
    this.phase += 1.0
    while (this.phase >= STEP) {
      const frac: f32 = 1.0 - (this.phase - STEP)
      const sample: f32 = this.prev + (filtered - this.prev) * frac
      this.output.put(sample)
      this.phase -= STEP
    }
    this.prev = filtered
  }
}

export default Resampler
