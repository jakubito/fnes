import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x09, ora, Address.Immediate)
  cpu.bind(0x05, ora, Address.Zeropage)
  cpu.bind(0x15, ora, Address.ZeropageX)
  cpu.bind(0x0d, ora, Address.Absolute)
  cpu.bind(0x1d, ora, Address.AbsoluteX)
  cpu.bind(0x19, ora, Address.AbsoluteY)
  cpu.bind(0x01, ora, Address.IndirectX)
  cpu.bind(0x11, ora, Address.IndirectY)
}

export function ora(cpu: Cpu, param: u16, mode: Address): void {
  cpu.ac |= mode == Address.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
