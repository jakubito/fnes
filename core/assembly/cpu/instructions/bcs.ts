import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xb0, bcs, Address.Relative)
}

function bcs(cpu: Cpu, value: u16, mode: Address): void {
  if (cpu.getStatus(Status.Carry)) cpu.pc += <i8>value
}

export default bind
