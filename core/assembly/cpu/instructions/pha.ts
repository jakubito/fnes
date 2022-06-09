import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x48, pha, Mode.Implied, 3)
}

function pha(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.pushToStack(cpu.ac)
}

export default bind
