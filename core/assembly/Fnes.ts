import { Drive, Interrupts } from './common'
import { Interrupt } from './common/enums'
import { Ppu, Bus as PpuBus } from './ppu'
import { Cpu, Bus as CpuBus } from './cpu'

class Fnes {
  drive: Drive = new Drive()
  interrupts: Interrupts = new Interrupts()
  ppu: Ppu = new Ppu(new PpuBus(this.drive, this.interrupts))
  cpu: Cpu = new Cpu(new CpuBus(this.drive, this.interrupts, this.ppu))

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
