import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x78, sei, Address.Implied)
}

function sei(cpu: Cpu, value: u16, mode: Address): void {
  cpu.setStatus(Status.Interrupt, true)
}

export default bind
