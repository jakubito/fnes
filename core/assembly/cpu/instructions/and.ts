import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x29, and, Address.Immediate, 2)
  cpu.bind(0x25, and, Address.Zeropage, 3)
  cpu.bind(0x35, and, Address.ZeropageX, 4)
  cpu.bind(0x2d, and, Address.Absolute, 4)
  cpu.bind(0x3d, and, Address.AbsoluteX, 4, true)
  cpu.bind(0x39, and, Address.AbsoluteY, 4, true)
  cpu.bind(0x21, and, Address.IndirectX, 6)
  cpu.bind(0x31, and, Address.IndirectY, 5, true)
}

export function and(cpu: Cpu, param: u16, mode: Address): void {
  cpu.ac &= mode == Address.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
