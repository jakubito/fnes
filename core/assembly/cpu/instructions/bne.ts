import { pageCrossed } from '../../helpers'
import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xd0, bne, Address.Relative, 2)
}

function bne(cpu: Cpu, param: u16, mode: Address): void {
  if (!cpu.getStatus(Status.Zero)) {
    const oldPc = cpu.pc
    cpu.pc += <i8>param
    cpu.cycles += <u8>pageCrossed(oldPc, cpu.pc) + 1
  }
}

export default bind
