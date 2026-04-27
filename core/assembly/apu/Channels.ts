import Triangle from './triangle/Triangle'

class Channels {
  triangle: Triangle = new Triangle()
  // pulse1: PulseChannel = new PulseChannel()
  // pulse2: PulseChannel = new PulseChannel()
  // noise: NoiseChannel = new NoiseChannel()

  reset(): void {
    this.triangle.reset()
  }
}

export default Channels
