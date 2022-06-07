import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xc9, cmp, Address.Immediate, 2)
  cpu.bind(0xc5, cmp, Address.Zeropage, 3)
  cpu.bind(0xd5, cmp, Address.ZeropageX, 4)
  cpu.bind(0xcd, cmp, Address.Absolute, 4)
  cpu.bind(0xdd, cmp, Address.AbsoluteX, 4, true)
  cpu.bind(0xd9, cmp, Address.AbsoluteY, 4, true)
  cpu.bind(0xc1, cmp, Address.IndirectX, 6)
  cpu.bind(0xd1, cmp, Address.IndirectY, 5, true)
}

export function cmp(cpu: Cpu, param: u16, mode: Address): void {
  const value = mode == Address.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Carry, cpu.ac >= value)
  cpu.setStatus(Status.Zero, cpu.ac == value)
  cpu.setStatus(Status.Negative, <bool>((cpu.ac - value) >> 7))
}

export default bind
