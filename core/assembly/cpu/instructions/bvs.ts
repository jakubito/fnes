import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x70, bvs, Address.Relative)
}

function bvs(cpu: Cpu, value: u16, mode: Address): void {
  if (cpu.getStatus(Status.Overflow)) cpu.pc += <i8>value
}

export default bind
