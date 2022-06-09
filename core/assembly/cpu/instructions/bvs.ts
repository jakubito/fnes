import { pageCrossed } from '../../helpers'
import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x70, bvs, Mode.Relative, 2)
}

function bvs(cpu: Cpu, param: u16, mode: Mode): void {
  if (cpu.getStatus(Status.Overflow)) {
    const oldPc = cpu.pc
    cpu.pc += <i8>param
    cpu.cycles += <u8>pageCrossed(oldPc, cpu.pc) + 1
  }
}

export default bind
