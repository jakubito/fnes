import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x68, pla, Mode.Implied, 4)
}

function pla(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.ac = cpu.pullFromStack()
  cpu.sr.set(Status.Zero, cpu.ac == 0)
  cpu.sr.set(Status.Negative, cpu.ac >> 7)
}

export default bind
