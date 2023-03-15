import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x6a, rorAc, Mode.Accumulator, 2)
  cpu.bind(0x66, ror, Mode.Zeropage, 5)
  cpu.bind(0x76, ror, Mode.ZeropageX, 6)
  cpu.bind(0x6e, ror, Mode.Absolute, 6)
  cpu.bind(0x7e, ror, Mode.AbsoluteX, 7)
}

export function rorAc(cpu: Cpu, param: u16, mode: Mode): void {
  const oldCarry = <u8>cpu.sr.get(Status.Carry)
  cpu.sr.set(Status.Carry, cpu.ac & 1)
  cpu.ac = (cpu.ac >> 1) | (oldCarry << 7)
  cpu.sr.set(Status.Zero, cpu.ac == 0)
  cpu.sr.set(Status.Negative, cpu.ac >> 7)
}

export function ror(cpu: Cpu, param: u16, mode: Mode): void {
  const oldCarry = <u8>cpu.sr.get(Status.Carry)
  const value = cpu.load(param)
  const newValue = (value >> 1) | (oldCarry << 7)
  cpu.store(param, newValue)
  cpu.sr.set(Status.Carry, value & 1)
  cpu.sr.set(Status.Zero, newValue == 0)
  cpu.sr.set(Status.Negative, newValue >> 7)
}

export default bind
