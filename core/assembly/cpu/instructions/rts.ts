import { word } from '../../helpers'
import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x60, rts, Mode.Implied, 6)
}

function rts(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.pc = word(cpu.pullFromStack(), cpu.pullFromStack()) + 1
}

export default bind
