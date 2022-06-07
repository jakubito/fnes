import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x10, bpl, Address.Relative, 2)
}

function bpl(cpu: Cpu, param: u16, mode: Address): void {
  if (!cpu.getStatus(Status.Negative)) {
    const oldPc = cpu.pc
    cpu.pc += <i8>param
    cpu.cycles += <u8>(<bool>(oldPc >> 8 != cpu.pc >> 8)) + 1
  }
}

export default bind
