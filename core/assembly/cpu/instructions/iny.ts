import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xc8, iny, Mode.Implied, 2)
}

function iny(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.y += 1
  cpu.setStatus(Status.Zero, cpu.y == 0)
  cpu.setStatus(Status.Negative, cpu.y >> 7)
}

export default bind
