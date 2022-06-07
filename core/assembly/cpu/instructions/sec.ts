import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x38, sec, Address.Implied, 2)
}

function sec(cpu: Cpu, param: u16, mode: Address): void {
  cpu.setStatus(Status.Carry, true)
}

export default bind
