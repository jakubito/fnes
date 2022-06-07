import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xaa, tax, Address.Implied, 2)
}

function tax(cpu: Cpu, param: u16, mode: Address): void {
  cpu.x = cpu.ac
  cpu.setStatus(Status.Zero, cpu.x == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.x >> 7))
}

export default bind
