import { Drive, Interrupts } from './main'
import { Interrupt } from './main/enums'
import { Ppu, Bus as PpuBus } from './ppu'
import { Cpu, Bus as CpuBus } from './cpu'

class Fnes {
  drive: Drive = new Drive()
  interrupts: Interrupts = new Interrupts()
  ppuBus: PpuBus = new PpuBus(this.drive)
  ppu: Ppu = new Ppu(this.ppuBus, this.interrupts)
  cpuBus: CpuBus = new CpuBus(this.drive, this.ppu)
  cpu: Cpu = new Cpu(this.cpuBus, this.interrupts)

  constructor() {}

  loadRom(buffer: ArrayBuffer): void {
    this.drive.setRom(buffer)
    this.reset()
  }

  reset(): void {
    this.cpu.reset()
    this.ppu.reset()
    this.interrupts.reset()
    this.interrupts.trigger(Interrupt.Reset)
    this.cpu.step()
  }

  renderFrame(): void {
    this.cpu.runUntilNmi()
  }

  getState(): StaticArray<usize> {
    return [
      this.cpu.pc,
      this.cpu.sp,
      this.cpu.sr.value,
      this.cpu.ac,
      this.cpu.x,
      this.cpu.y,
      this.cpu.totalCycles,
      this.ppu.line,
      this.ppu.dot,
    ]
  }
}

export default Fnes
