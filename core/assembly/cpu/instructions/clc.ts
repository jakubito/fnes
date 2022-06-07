import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x18, clc, Address.Implied, 2)
}

function clc(cpu: Cpu, param: u16, mode: Address): void {
  cpu.setStatus(Status.Carry, false)
}

export default bind
