import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x2a, rolAc, Mode.Accumulator, 2)
  cpu.bind(0x26, rol, Mode.Zeropage, 5)
  cpu.bind(0x36, rol, Mode.ZeropageX, 6)
  cpu.bind(0x2e, rol, Mode.Absolute, 6)
  cpu.bind(0x3e, rol, Mode.AbsoluteX, 7)
}

function rolAc(cpu: Cpu, param: u16, mode: Mode): void {
  const oldCarry = <u8>cpu.sr.get(Status.Carry)
  cpu.sr.set(Status.Carry, cpu.ac >> 7)
  cpu.ac = (cpu.ac << 1) | oldCarry
  cpu.sr.set(Status.Zero, cpu.ac == 0)
  cpu.sr.set(Status.Negative, cpu.ac >> 7)
}

export function rol(cpu: Cpu, param: u16, mode: Mode): void {
  const oldCarry = <u8>cpu.sr.get(Status.Carry)
  const value = cpu.load(param)
  const newValue = (value << 1) | oldCarry
  cpu.store(param, newValue)
  cpu.sr.set(Status.Carry, value >> 7)
  cpu.sr.set(Status.Zero, newValue == 0)
  cpu.sr.set(Status.Negative, newValue >> 7)
}

export default bind
