import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x4a, lsrAc, Address.Accumulator)
  cpu.bind(0x46, lsr, Address.Zeropage)
  cpu.bind(0x56, lsr, Address.ZeropageX)
  cpu.bind(0x4e, lsr, Address.Absolute)
  cpu.bind(0x5e, lsr, Address.AbsoluteX)
}

function lsrAc(cpu: Cpu, value: u16, mode: Address): void {
  cpu.setStatus(Status.Carry, <bool>(cpu.ac & 1))
  cpu.ac >>= 1
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

function lsr(cpu: Cpu, value: u16, mode: Address): void {
  cpu.setStatus(Status.Carry, <bool>(cpu.load(value) & 1))
  cpu.store(value, cpu.load(value) >> 1)
  cpu.setStatus(Status.Zero, cpu.load(value) == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.load(value) >> 7))
}

export default bind
