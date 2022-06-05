import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x69, adc, Address.Immediate)
  cpu.bind(0x65, adc, Address.Zeropage)
  cpu.bind(0x75, adc, Address.ZeropageX)
  cpu.bind(0x6d, adc, Address.Absolute)
  cpu.bind(0x7d, adc, Address.AbsoluteX)
  cpu.bind(0x79, adc, Address.AbsoluteY)
  cpu.bind(0x61, adc, Address.IndirectX)
  cpu.bind(0x71, adc, Address.IndirectY)
}

export function adc(cpu: Cpu, param: u16, mode: Address): void {
  const value = mode == Address.Immediate ? <u8>param : cpu.load(param)
  const sum = <u16>cpu.ac + value + <u8>cpu.getStatus(Status.Carry)
  const overflow = ~(cpu.ac ^ value) & (cpu.ac ^ sum) & 0b1000_0000
  cpu.ac = <u8>sum
  cpu.setStatus(Status.Carry, sum > 0xff)
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Overflow, <bool>overflow)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
