import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x88, dey, Mode.Implied, 2)
}

function dey(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.y -= 1
  cpu.sr.set(Status.Zero, cpu.y == 0)
  cpu.sr.set(Status.Negative, cpu.y >> 7)
}

export default bind
