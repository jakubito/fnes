import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xb8, clv, Address.Implied)
}

function clv(cpu: Cpu, value: u16, mode: Address): void {
  cpu.setStatus(Status.Overflow, false)
}

export default bind
