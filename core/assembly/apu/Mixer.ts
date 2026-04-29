import Channels from './Channels'
import { MIXER_TND } from './tables'

class Mixer {
  constructor(private channels: Channels) {}

  getValue(): f32 {
    // const pulseOut = PULSE_LOOKUP[pulse1 + pulse2]
    const pulseOut: f32 = 0
    const triangle = this.channels.triangle.getValue()
    const noise = this.channels.noise.getValue()
    // const tndOut = TND[3 * triangle + 2 * noise + dmc]
    const tndOut = MIXER_TND[3 * triangle + 2 * noise]
    return pulseOut + tndOut
  }
}

export default Mixer
