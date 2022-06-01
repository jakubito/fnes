import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xd8, cld, Address.Implied)
}

function cld(cpu: Cpu, value: u16, mode: Address): void {
  cpu.setStatus(Status.Decimal, false)
}

export default bind
