import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xe8, inx, Address.Implied)
}

function inx(cpu: Cpu, param: u16, mode: Address): void {
  cpu.x += 1
  cpu.setStatus(Status.Zero, cpu.x == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.x >> 7))
}

export default bind
