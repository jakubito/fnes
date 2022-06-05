import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xc9, cmp, Address.Immediate)
  cpu.bind(0xc5, cmp, Address.Zeropage)
  cpu.bind(0xd5, cmp, Address.ZeropageX)
  cpu.bind(0xcd, cmp, Address.Absolute)
  cpu.bind(0xdd, cmp, Address.AbsoluteX)
  cpu.bind(0xd9, cmp, Address.AbsoluteY)
  cpu.bind(0xc1, cmp, Address.IndirectX)
  cpu.bind(0xd1, cmp, Address.IndirectY)
}

export function cmp(cpu: Cpu, param: u16, mode: Address): void {
  const value = mode == Address.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Carry, cpu.ac >= value)
  cpu.setStatus(Status.Zero, cpu.ac == value)
  cpu.setStatus(Status.Negative, <bool>((cpu.ac - value) >> 7))
}

export default bind
