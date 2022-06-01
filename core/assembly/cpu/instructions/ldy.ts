import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xa0, ldy, Address.Immediate)
  cpu.bind(0xa4, ldy, Address.Zeropage)
  cpu.bind(0xb4, ldy, Address.ZeropageX)
  cpu.bind(0xac, ldy, Address.Absolute)
  cpu.bind(0xbc, ldy, Address.AbsoluteX)
}

function ldy(cpu: Cpu, value: u16, mode: Address): void {
  cpu.y = mode == Address.Immediate ? <u8>value : cpu.load(value)
  cpu.setStatus(Status.Zero, cpu.y == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.y >> 7))
}

export default bind
