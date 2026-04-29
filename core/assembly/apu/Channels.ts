import { bit } from '../main/helpers'
import { Channel } from './enums'
import Noise from './noise/Noise'
import Triangle from './triangle/Triangle'

class Channels {
  triangle: Triangle = new Triangle()
  noise: Noise = new Noise()

  reset(): void {
    this.triangle.reset()
    this.noise.reset()
  }

  @inline
  getStatus(): u8 {
    const triangle: u8 = (<u8>this.triangle.getStatus()) << Channel.Triangle
    const noise: u8 = (<u8>this.noise.getStatus()) << Channel.Noise
    return triangle | noise
  }

  @inline
  setControl(value: u8): void {
    if (bit(value, Channel.Triangle)) this.triangle.enable()
    else this.triangle.disable()
    if (bit(value, Channel.Noise)) this.noise.enable()
    else this.noise.disable()
  }
}

export default Channels
