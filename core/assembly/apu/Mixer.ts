import Channels from './Channels'
import { MIXER_PULSE, MIXER_TND } from './tables'

class Mixer {
  constructor(private channels: Channels) {}

  getValue(): f32 {
    const pulse1 = this.channels.pulse1.getValue()
    const pulse2 = this.channels.pulse2.getValue()
    const triangle = this.channels.triangle.getValue()
    const noise = this.channels.noise.getValue()
    const dmc = this.channels.dmc.getValue()

    const pulseOut = MIXER_PULSE[pulse1 + pulse2]
    const tndOut = MIXER_TND[3 * triangle + 2 * noise + dmc]

    return pulseOut + tndOut
  }
}

export default Mixer
