import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xcb, sbx, Mode.Immediate, 2)
}

function sbx(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.x = (cpu.ac & cpu.x) - <u8>param
  cpu.sr.set(Status.Carry, cpu.x >= param)
  cpu.sr.set(Status.Zero, cpu.x == param)
  cpu.sr.set(Status.Negative, (cpu.x - param) >> 7)
}

export default bind
