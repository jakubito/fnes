import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x00, brk, Address.Implied)
}

function brk(cpu: Cpu, param: u16, mode: Address): void {
  cpu.pushToStack(<u8>((cpu.pc + 1) >> 8))
  cpu.pushToStack(<u8>cpu.pc + 1)
  cpu.pushToStack(cpu.sr | 0b0011_0000)
  cpu.setStatus(Status.Break, true)
}

export default bind
