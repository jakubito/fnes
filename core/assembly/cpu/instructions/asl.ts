import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x0a, aslAc, Address.Accumulator)
  cpu.bind(0x06, asl, Address.Zeropage)
  cpu.bind(0x16, asl, Address.ZeropageX)
  cpu.bind(0x0e, asl, Address.Absolute)
  cpu.bind(0x1e, asl, Address.AbsoluteX)
}

function aslAc(cpu: Cpu, param: u16, mode: Address): void {
  cpu.setStatus(Status.Carry, <bool>(cpu.ac >> 7))
  cpu.ac <<= 1
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export function asl(cpu: Cpu, param: u16, mode: Address): void {
  cpu.setStatus(Status.Carry, <bool>(cpu.load(param) >> 7))
  cpu.store(param, cpu.load(param) << 1)
  cpu.setStatus(Status.Zero, cpu.load(param) == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.load(param) >> 7))
}

export default bind
