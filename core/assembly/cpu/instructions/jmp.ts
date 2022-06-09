import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x4c, jmp, Mode.Absolute, 3)
  cpu.bind(0x6c, jmp, Mode.Indirect, 5)
}

function jmp(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.pc = param
}

export default bind
