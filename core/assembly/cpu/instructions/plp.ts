import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x28, plp, Mode.Implied, 4)
}

function plp(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.sr.setValue((cpu.sr.value & 0b0011_0000) | (cpu.pullFromStack() & 0b1100_1111))
}

export default bind
