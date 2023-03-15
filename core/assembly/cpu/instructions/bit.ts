import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x24, bit, Mode.Zeropage, 3)
  cpu.bind(0x2c, bit, Mode.Absolute, 4)
}

function bit(cpu: Cpu, param: u16, mode: Mode): void {
  const value = cpu.load(param)
  cpu.sr.set(Status.Zero, (cpu.ac & value) == 0)
  cpu.sr.set(Status.Overflow, (value >> 6) & 1)
  cpu.sr.set(Status.Negative, value >> 7)
}

export default bind
