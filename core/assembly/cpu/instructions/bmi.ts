import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x30, bmi, Address.Relative)
}

function bmi(cpu: Cpu, value: u16, mode: Address): void {
  if (cpu.getStatus(Status.Negative)) cpu.pc += <i8>value
}

export default bind
