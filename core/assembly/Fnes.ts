import { Drive } from './drive'
import { Cpu, Bus as CpuBus } from './cpu'
import { Ppu, Bus as PpuBus } from './ppu'

class Fnes {
  drive: Drive = new Drive()
  ppu: Ppu = new Ppu(new PpuBus(this.drive))
  cpu: Cpu = new Cpu(new CpuBus(this.drive, this.ppu))

  constructor() {}

  loadRom(buffer: ArrayBuffer): void {
    this.drive.loadRom(buffer)
    this.cpu.reset()
  }
}

export default Fnes
