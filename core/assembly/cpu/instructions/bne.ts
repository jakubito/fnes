import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xd0, bne, Address.Relative)
}

function bne(cpu: Cpu, param: u16, mode: Address): void {
  if (!cpu.getStatus(Status.Zero)) cpu.pc += <i8>param
}

export default bind
