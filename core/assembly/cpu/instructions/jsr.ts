import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x20, jsr, Mode.Absolute, 6)
}

function jsr(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.pushToStack(<u8>((cpu.pc - 1) >> 8))
  cpu.pushToStack(<u8>cpu.pc - 1)
  cpu.pc = param
}

export default bind
