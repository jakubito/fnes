import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xa2, ldx, Address.Immediate, 2)
  cpu.bind(0xa6, ldx, Address.Zeropage, 3)
  cpu.bind(0xb6, ldx, Address.ZeropageY, 4)
  cpu.bind(0xae, ldx, Address.Absolute, 4)
  cpu.bind(0xbe, ldx, Address.AbsoluteY, 4, true)
}

export function ldx(cpu: Cpu, param: u16, mode: Address): void {
  cpu.x = mode == Address.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Zero, cpu.x == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.x >> 7))
}

export default bind
