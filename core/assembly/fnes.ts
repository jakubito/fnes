import Bus from './bus'
import Cpu from './cpu'

class Fnes {
  bus: Bus = new Bus()
  cpu: Cpu = new Cpu(this.bus)

  constructor() {}

  loadRom(buffer: ArrayBuffer): void {
    this.bus.setRom(buffer)
    this.cpu.reset()
  }
}

export default Fnes
