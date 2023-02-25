import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x4a, lsrAc, Mode.Accumulator, 2)
  cpu.bind(0x46, lsr, Mode.Zeropage, 5)
  cpu.bind(0x56, lsr, Mode.ZeropageX, 6)
  cpu.bind(0x4e, lsr, Mode.Absolute, 6)
  cpu.bind(0x5e, lsr, Mode.AbsoluteX, 7)
}

export function lsrAc(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.sr.set(Status.Carry, cpu.ac & 1)
  cpu.ac >>= 1
  cpu.sr.set(Status.Zero, cpu.ac == 0)
  cpu.sr.set(Status.Negative, cpu.ac >> 7)
}

export function lsr(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.sr.set(Status.Carry, cpu.load(param) & 1)
  cpu.store(param, cpu.load(param) >> 1)
  cpu.sr.set(Status.Zero, cpu.load(param) == 0)
  cpu.sr.set(Status.Negative, cpu.load(param) >> 7)
}

export default bind
