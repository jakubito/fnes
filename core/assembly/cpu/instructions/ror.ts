import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x6a, rorAc, Address.Accumulator)
  cpu.bind(0x66, ror, Address.Zeropage)
  cpu.bind(0x76, ror, Address.ZeropageX)
  cpu.bind(0x6e, ror, Address.Absolute)
  cpu.bind(0x7e, ror, Address.AbsoluteX)
}

function rorAc(cpu: Cpu, value: u16, mode: Address): void {
  const oldCarry = cpu.getStatus(Status.Carry)
  cpu.setStatus(Status.Carry, <bool>(cpu.ac & 1))
  cpu.ac >>= 1
  cpu.ac |= (<u8>oldCarry) << 7
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

function ror(cpu: Cpu, value: u16, mode: Address): void {
  const oldCarry = cpu.getStatus(Status.Carry)
  cpu.setStatus(Status.Carry, <bool>(cpu.load(value) & 1))
  cpu.store(value, (cpu.load(value) >> 1) | ((<u8>oldCarry) << 7))
  cpu.setStatus(Status.Zero, cpu.load(value) == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.load(value) >> 7))
}

export default bind
