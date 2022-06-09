import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x08, php, Mode.Implied, 3)
}

function php(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.pushToStack(cpu.sr.value | 0b0011_0000)
}

export default bind
