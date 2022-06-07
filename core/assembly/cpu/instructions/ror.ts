import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x6a, rorAc, Address.Accumulator, 2)
  cpu.bind(0x66, ror, Address.Zeropage, 5)
  cpu.bind(0x76, ror, Address.ZeropageX, 6)
  cpu.bind(0x6e, ror, Address.Absolute, 6)
  cpu.bind(0x7e, ror, Address.AbsoluteX, 7)
}

export function rorAc(cpu: Cpu, param: u16, mode: Address): void {
  const oldCarry = cpu.getStatus(Status.Carry)
  cpu.setStatus(Status.Carry, <bool>(cpu.ac & 1))
  cpu.ac = (cpu.ac >> 1) | ((<u8>oldCarry) << 7)
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export function ror(cpu: Cpu, param: u16, mode: Address): void {
  const oldCarry = cpu.getStatus(Status.Carry)
  cpu.setStatus(Status.Carry, <bool>(cpu.load(param) & 1))
  cpu.store(param, (cpu.load(param) >> 1) | ((<u8>oldCarry) << 7))
  cpu.setStatus(Status.Zero, cpu.load(param) == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.load(param) >> 7))
}

export default bind
