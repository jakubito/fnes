import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x0a, aslAc, Mode.Accumulator, 2)
  cpu.bind(0x06, asl, Mode.Zeropage, 5)
  cpu.bind(0x16, asl, Mode.ZeropageX, 6)
  cpu.bind(0x0e, asl, Mode.Absolute, 6)
  cpu.bind(0x1e, asl, Mode.AbsoluteX, 7)
}

function aslAc(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.sr.set(Status.Carry, cpu.ac >> 7)
  cpu.ac <<= 1
  cpu.sr.set(Status.Zero, cpu.ac == 0)
  cpu.sr.set(Status.Negative, cpu.ac >> 7)
}

export function asl(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.sr.set(Status.Carry, cpu.load(param) >> 7)
  cpu.store(param, cpu.load(param) << 1)
  cpu.sr.set(Status.Zero, cpu.load(param) == 0)
  cpu.sr.set(Status.Negative, cpu.load(param) >> 7)
}

export default bind
