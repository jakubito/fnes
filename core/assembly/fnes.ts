import Drive from './Drive'
import { Cpu, Bus as CpuBus } from './cpu'
import { Ppu, Bus as PpuBus } from './ppu'

class Fnes {
  drive: Drive = new Drive()
  ppuBus: PpuBus = new PpuBus(this.drive)
  ppu: Ppu = new Ppu(this.ppuBus)
  cpuBus: CpuBus = new CpuBus(this.drive, this.ppu)
  cpu: Cpu = new Cpu(this.cpuBus)

  constructor() {}

  loadRom(buffer: ArrayBuffer): void {
    this.drive.loadRom(buffer)
    this.cpu.reset()
  }
}

export default Fnes
