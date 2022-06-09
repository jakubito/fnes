import { word } from '../../helpers'
import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x40, rti, Mode.Implied, 6)
}

function rti(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.sr.value = (cpu.sr.value & 0b0011_0000) | (cpu.pullFromStack() & 0b1100_1111)
  cpu.pc = word(cpu.pullFromStack(), cpu.pullFromStack())
}

export default bind
