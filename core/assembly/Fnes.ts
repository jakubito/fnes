import { Drive, Inputs, Interrupts } from './main'
import { Ppu, Bus as PpuBus } from './ppu'
import { Cpu, Bus as CpuBus } from './cpu'
import { Interrupt } from './cpu/enums'

class Fnes {
  drive: Drive = new Drive()
  inputs: Inputs = new Inputs()
  interrupts: Interrupts = new Interrupts()
  ppuBus: PpuBus = new PpuBus(this.drive)
  ppu: Ppu = new Ppu(this.ppuBus, this.interrupts)
  cpuBus: CpuBus = new CpuBus(this.drive, this.inputs, this.ppu)
  cpu: Cpu = new Cpu(this.cpuBus, this.interrupts)

  constructor() {}

  loadFile(buffer: ArrayBuffer): void {
    this.drive.loadFile(buffer)
    this.reset()
  }

  reset(): void {
    this.cpu.reset()
    this.ppu.reset()
    this.interrupts.reset()
    this.cpu.step()
  }

  renderFrame(): void {
    while (this.cpu.step() != Interrupt.Nmi) {}
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
      this.ppu.v,
      this.ppu.t,
      this.ppu.x,
      <usize>this.ppu.w,
    ]
  }
}

export default Fnes
