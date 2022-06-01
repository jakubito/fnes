import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x00, brk, Address.Implied)
}

function brk(cpu: Cpu, value: u16, mode: Address): void {
  // TODO
  cpu.setStatus(Status.Break, true)
}

export default bind
