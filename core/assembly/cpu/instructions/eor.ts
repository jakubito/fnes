import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x49, eor, Address.Immediate)
  cpu.bind(0x45, eor, Address.Zeropage)
  cpu.bind(0x55, eor, Address.ZeropageX)
  cpu.bind(0x4d, eor, Address.Absolute)
  cpu.bind(0x5d, eor, Address.AbsoluteX)
  cpu.bind(0x59, eor, Address.AbsoluteY)
  cpu.bind(0x41, eor, Address.IndirectX)
  cpu.bind(0x51, eor, Address.IndirectY)
}

function eor(cpu: Cpu, value: u16, mode: Address): void {
  cpu.ac ^= mode == Address.Immediate ? <u8>value : cpu.load(value)
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
