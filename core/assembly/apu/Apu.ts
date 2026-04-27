import { ApuRegister } from '../cpu/enums'
import { Interrupts } from '../main'
import { bit } from '../main/helpers'
import Channels from './Channels'
import { Channel } from './enums'
import FrameCounter from './FrameCounter'
import Mixer from './Mixer'
import Resampler from './Resampler'

class Apu {
  frameCounter: FrameCounter
  channels: Channels
  mixer: Mixer
  resampler: Resampler
  oddStep: bool = false

  constructor(interrupts: Interrupts) {
    const channels: Channels = new Channels()
    this.frameCounter = new FrameCounter(channels, interrupts)
    this.mixer = new Mixer(channels)
    this.resampler = new Resampler()
    this.channels = channels
    this.reset()
  }

  reset(): void {
    this.channels.reset()
    this.resampler.reset()
    this.frameCounter.reset()
    this.oddStep = false
  }

  @inline
  tick(cycles: usize): void {
    for (let i: usize = 0; i < cycles; i++) this.step()
  }

  @inline
  step(): void {
    this.resampler.put(this.mixer.getValue())
    this.channels.triangle.tick()
    if (this.oddStep) {
      this.frameCounter.tick()
    }
    this.oddStep = !this.oddStep
  }

  readStatus(): u8 {
    return (
      ((<u8>(<bool>(this.channels.triangle.length > 0))) << Channel.Triangle) |
      ((<u8>(<bool>(this.channels.triangle.length > 0))) << Channel.Triangle)
    )
  }

  store(address: u16, value: u8): void {
    switch (<i32>address) {
      case ApuRegister.TriangleLinearCtr:
        return this.channels.triangle.setLinearCounter(value)
      case ApuRegister.TriangleTimerLo:
        return this.channels.triangle.setTimerLo(value)
      case ApuRegister.TriangleTimerHi:
        return this.channels.triangle.setTimerHi(value)
      case ApuRegister.Control:
        return this.setControl(value)
      case ApuRegister.FrameCounter:
        return this.frameCounter.setup(value)
    }
  }

  @inline
  setControl(value: u8): void {
    if (bit(value, Channel.Triangle) == 0) {
      this.channels.triangle.resetCounter()
    }
  }
}

export default Apu
