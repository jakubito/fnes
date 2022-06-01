import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xf0, beq, Address.Relative)
}

function beq(cpu: Cpu, value: u16, mode: Address): void {
  if (cpu.getStatus(Status.Zero)) cpu.pc += <i8>value
}

export default bind
