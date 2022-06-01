import Bus from './bus'
import Cpu from './cpu'

class Fnes {
  bus: Bus = new Bus()
  cpu: Cpu = new Cpu(this.bus)

  constructor() {}
}

export default Fnes
