import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x18, clc, Address.Implied)
}

function clc(cpu: Cpu, value: u16, mode: Address): void {
  cpu.setStatus(Status.Carry, false)
}

export default bind
