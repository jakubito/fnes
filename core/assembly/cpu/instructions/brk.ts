import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x00, brk, Mode.Implied, 7)
}

function brk(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.pushToStack(<u8>((cpu.pc + 1) >> 8))
  cpu.pushToStack(<u8>cpu.pc + 1)
  cpu.pushToStack(cpu.sr.value | 0b0011_0000)
  cpu.setStatus(Status.Break, true)
}

export default bind
