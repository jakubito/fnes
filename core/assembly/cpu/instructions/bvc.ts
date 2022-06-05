import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x50, bvc, Address.Relative)
}

function bvc(cpu: Cpu, param: u16, mode: Address): void {
  if (!cpu.getStatus(Status.Overflow)) cpu.pc += <i8>param
}

export default bind
