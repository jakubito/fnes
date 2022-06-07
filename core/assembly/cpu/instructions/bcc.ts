import { pageCrossed } from '../../helpers'
import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x90, bcc, Address.Relative, 2)
}

function bcc(cpu: Cpu, param: u16, mode: Address): void {
  if (!cpu.getStatus(Status.Carry)) {
    const oldPc = cpu.pc
    cpu.pc += <i8>param
    cpu.cycles += <u8>pageCrossed(oldPc, cpu.pc) + 1
  }
}

export default bind
