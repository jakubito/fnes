import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x68, pla, Address.Implied)
}

function pla(cpu: Cpu, value: u16, mode: Address): void {
  cpu.ac = cpu.pullFromStack()
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
