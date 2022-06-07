import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x98, tya, Address.Implied, 2)
}

function tya(cpu: Cpu, param: u16, mode: Address): void {
  cpu.ac = cpu.y
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
