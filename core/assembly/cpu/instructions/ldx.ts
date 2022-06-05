import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xa2, ldx, Address.Immediate)
  cpu.bind(0xa6, ldx, Address.Zeropage)
  cpu.bind(0xb6, ldx, Address.ZeropageY)
  cpu.bind(0xae, ldx, Address.Absolute)
  cpu.bind(0xbe, ldx, Address.AbsoluteY)
}

export function ldx(cpu: Cpu, param: u16, mode: Address): void {
  cpu.x = mode == Address.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Zero, cpu.x == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.x >> 7))
}

export default bind
