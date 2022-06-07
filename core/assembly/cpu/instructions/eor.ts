import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x49, eor, Address.Immediate, 2)
  cpu.bind(0x45, eor, Address.Zeropage, 3)
  cpu.bind(0x55, eor, Address.ZeropageX, 4)
  cpu.bind(0x4d, eor, Address.Absolute, 4)
  cpu.bind(0x5d, eor, Address.AbsoluteX, 4, true)
  cpu.bind(0x59, eor, Address.AbsoluteY, 4, true)
  cpu.bind(0x41, eor, Address.IndirectX, 6)
  cpu.bind(0x51, eor, Address.IndirectY, 5, true)
}

export function eor(cpu: Cpu, param: u16, mode: Address): void {
  cpu.ac ^= mode == Address.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
