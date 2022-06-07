import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xa0, ldy, Address.Immediate, 2)
  cpu.bind(0xa4, ldy, Address.Zeropage, 3)
  cpu.bind(0xb4, ldy, Address.ZeropageX, 4)
  cpu.bind(0xac, ldy, Address.Absolute, 4)
  cpu.bind(0xbc, ldy, Address.AbsoluteX, 4, true)
}

function ldy(cpu: Cpu, param: u16, mode: Address): void {
  cpu.y = mode == Address.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Zero, cpu.y == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.y >> 7))
}

export default bind
