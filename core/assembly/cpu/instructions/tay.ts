import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xa8, tay, Mode.Implied, 2)
}

function tay(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.y = cpu.ac
  cpu.sr.set(Status.Zero, cpu.y == 0)
  cpu.sr.set(Status.Negative, cpu.y >> 7)
}

export default bind
