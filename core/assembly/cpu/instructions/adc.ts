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

function adc(cpu: Cpu, value: u16, mode: Address): void {
  const oldAc = cpu.ac
  cpu.ac += mode == Address.Immediate ? <u8>value : cpu.load(value)
  cpu.setStatus(Status.Carry, oldAc > cpu.ac)
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Overflow, <i8>oldAc > <i8>cpu.ac)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
