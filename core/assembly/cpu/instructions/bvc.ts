import Cpu from '../Cpu'
import { pageCrossed } from '../helpers'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x50, bvc, Mode.Relative, 2)
}

function bvc(cpu: Cpu, param: u16, mode: Mode): void {
  if (!cpu.getStatus(Status.Overflow)) {
    const oldPc = cpu.pc
    cpu.pc += <i8>param
    cpu.cycles += <u8>pageCrossed(oldPc, cpu.pc) + 1
  }
}

export default bind
