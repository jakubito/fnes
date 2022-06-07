import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x8a, txa, Address.Implied, 2)
}

function txa(cpu: Cpu, param: u16, mode: Address): void {
  cpu.ac = cpu.x
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
