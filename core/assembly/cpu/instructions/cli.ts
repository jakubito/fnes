import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x58, cli, Address.Implied)
}

function cli(cpu: Cpu, value: u16, mode: Address): void {
  cpu.setStatus(Status.Interrupt, false)
}

export default bind
