import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x2a, rolAc, Address.Accumulator)
  cpu.bind(0x26, rol, Address.Zeropage)
  cpu.bind(0x36, rol, Address.ZeropageX)
  cpu.bind(0x2e, rol, Address.Absolute)
  cpu.bind(0x3e, rol, Address.AbsoluteX)
}

function rolAc(cpu: Cpu, param: u16, mode: Address): void {
  const oldCarry = cpu.getStatus(Status.Carry)
  cpu.setStatus(Status.Carry, <bool>(cpu.ac >> 7))
  cpu.ac = (cpu.ac << 1) | (<u8>oldCarry)
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export function rol(cpu: Cpu, param: u16, mode: Address): void {
  const oldCarry = cpu.getStatus(Status.Carry)
  cpu.setStatus(Status.Carry, <bool>(cpu.load(param) >> 7))
  cpu.store(param, (cpu.load(param) << 1) | (<u8>oldCarry))
  cpu.setStatus(Status.Zero, cpu.load(param) == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.load(param) >> 7))
}

export default bind
