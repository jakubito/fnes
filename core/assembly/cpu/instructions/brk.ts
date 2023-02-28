import { Interrupt, InterruptVector } from '../../main/enums'
import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x00, brk, Mode.Implied, 7)
}

function brk(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.pushWordToStack(cpu.pc + 1)
  cpu.pushToStack(cpu.sr.value | 0b0011_0000)
  cpu.pc = cpu.loadWord(InterruptVector[Interrupt.Irq])
}

export default bind
