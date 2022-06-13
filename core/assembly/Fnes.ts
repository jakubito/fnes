import { Drive, Interrupts } from './common'
import { Cpu, Bus as CpuBus } from './cpu'
import { Ppu, Bus as PpuBus } from './ppu'

class Fnes {
  drive: Drive = new Drive()
  interrupts: Interrupts = new Interrupts()
  ppu: Ppu = new Ppu(new PpuBus(this.drive, this.interrupts))
  cpu: Cpu = new Cpu(new CpuBus(this.drive, this.interrupts, this.ppu))

  constructor() {}

  loadRom(buffer: ArrayBuffer): void {
    this.drive.setRom(buffer)
    this.cpu.reset()
  }
}

export default Fnes
