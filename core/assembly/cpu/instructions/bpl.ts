import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x10, bpl, Address.Relative)
}

function bpl(cpu: Cpu, value: u16, mode: Address): void {
  if (!cpu.getStatus(Status.Negative)) cpu.pc += <i8>value
}

export default bind
