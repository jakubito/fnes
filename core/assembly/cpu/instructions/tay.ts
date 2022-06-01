import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xa8, tay, Address.Implied)
}

function tay(cpu: Cpu, value: u16, mode: Address): void {
  cpu.y = cpu.ac
  cpu.setStatus(Status.Zero, cpu.y == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.y >> 7))
}

export default bind
