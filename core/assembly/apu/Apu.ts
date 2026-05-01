import { ApuRegister } from '../cpu/enums'
import { Interrupts } from '../main'
import Channels from './Channels'
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
      this.channels.pulse1.tick()
      this.channels.pulse2.tick()
      this.channels.noise.tick()
      this.frameCounter.tick()
    }
    this.oddStep = !this.oddStep
  }

  store(address: u16, value: u8): void {
    switch (<i32>address) {
      case ApuRegister.Pulse1Duty:
        return this.channels.pulse1.setDuty(value)
      case ApuRegister.Pulse1Sweep:
        return this.channels.pulse1.sweep.setup(value)
      case ApuRegister.Pulse1TimerLo:
        return this.channels.pulse1.setTimerLo(value)
      case ApuRegister.Pulse1TimerHi:
        return this.channels.pulse1.setTimerHi(value)
      case ApuRegister.Pulse2Duty:
        return this.channels.pulse2.setDuty(value)
      case ApuRegister.Pulse2Sweep:
        return this.channels.pulse2.sweep.setup(value)
      case ApuRegister.Pulse2TimerLo:
        return this.channels.pulse2.setTimerLo(value)
      case ApuRegister.Pulse2TimerHi:
        return this.channels.pulse2.setTimerHi(value)
      case ApuRegister.TriangleLinearCtr:
        return this.channels.triangle.setLinearCounter(value)
      case ApuRegister.TriangleTimerLo:
        return this.channels.triangle.setTimerLo(value)
      case ApuRegister.TriangleTimerHi:
        return this.channels.triangle.setTimerHi(value)
      case ApuRegister.NoiseEnvelope:
        return this.channels.noise.envelope.setup(value)
      case ApuRegister.NoiseTimer:
        return this.channels.noise.setTimer(value)
      case ApuRegister.NoiseLength:
        return this.channels.noise.setLength(value)
      case ApuRegister.Control:
        return this.channels.setControl(value)
      case ApuRegister.FrameCounter:
        return this.frameCounter.setup(value)
    }
  }
}

export default Apu
