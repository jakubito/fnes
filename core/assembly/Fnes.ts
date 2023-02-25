import { Drive, Interrupts } from './main'
import { Interrupt } from './main/enums'
import { Ppu, Bus as PpuBus } from './ppu'
import { Cpu, Bus as CpuBus } from './cpu'

class Fnes {
  drive: Drive = new Drive()
  interrupts: Interrupts = new Interrupts()
  ppuBus: PpuBus = new PpuBus(this.drive)
  ppu: Ppu = new Ppu(this.ppuBus)
  cpuBus: CpuBus = new CpuBus(this.drive, this.ppu)
  cpu: Cpu = new Cpu(this.cpuBus, this.interrupts)

  constructor() {}

  loadRom(buffer: ArrayBuffer): void {
    this.drive.setRom(buffer)
    this.reset()
  }

  reset(): void {
    this.interrupts.reset()
    this.interrupts.set(Interrupt.Reset)
    this.cpu.reset()
    this.cpu.step()
  }
}

export default Fnes
