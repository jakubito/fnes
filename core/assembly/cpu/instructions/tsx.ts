import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xba, tsx, Mode.Implied, 2)
}

function tsx(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.x = cpu.sp
  cpu.sr.set(Status.Zero, cpu.x == 0)
  cpu.sr.set(Status.Negative, cpu.x >> 7)
}

export default bind
