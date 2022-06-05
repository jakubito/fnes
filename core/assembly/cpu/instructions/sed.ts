import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xf8, sed, Address.Implied)
}

function sed(cpu: Cpu, param: u16, mode: Address): void {
  cpu.setStatus(Status.Decimal, true)
}

export default bind
