import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xc8, iny, Address.Implied, 2)
}

function iny(cpu: Cpu, param: u16, mode: Address): void {
  cpu.y += 1
  cpu.setStatus(Status.Zero, cpu.y == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.y >> 7))
}

export default bind
