import { bit } from '../main/helpers'
import { Channel } from './enums'
import Noise from './noise/Noise'
import Pulse from './pulse/Pulse'
import Triangle from './triangle/Triangle'

class Channels {
  pulse1: Pulse = new Pulse(0)
  pulse2: Pulse = new Pulse(1)
  triangle: Triangle = new Triangle()
  noise: Noise = new Noise()

  reset(): void {
    this.pulse1.reset()
    this.pulse2.reset()
    this.triangle.reset()
    this.noise.reset()
  }

  @inline
  getStatus(): u8 {
    const pulse1: u8 = (<u8>this.pulse1.getStatus()) << Channel.Pulse1
    const pulse2: u8 = (<u8>this.pulse2.getStatus()) << Channel.Pulse2
    const triangle: u8 = (<u8>this.triangle.getStatus()) << Channel.Triangle
    const noise: u8 = (<u8>this.noise.getStatus()) << Channel.Noise
    return pulse1 | pulse2 | triangle | noise
  }

  @inline
  setControl(value: u8): void {
    if (bit(value, Channel.Pulse1)) this.pulse1.enable()
    else this.pulse1.disable()
    if (bit(value, Channel.Pulse2)) this.pulse2.enable()
    else this.pulse2.disable()
    if (bit(value, Channel.Triangle)) this.triangle.enable()
    else this.triangle.disable()
    if (bit(value, Channel.Noise)) this.noise.enable()
    else this.noise.disable()
  }
}

export default Channels
