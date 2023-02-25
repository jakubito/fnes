import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xe6, inc, Mode.Zeropage, 5)
  cpu.bind(0xf6, inc, Mode.ZeropageX, 6)
  cpu.bind(0xee, inc, Mode.Absolute, 6)
  cpu.bind(0xfe, inc, Mode.AbsoluteX, 7)
}

export function inc(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.store(param, cpu.load(param) + 1)
  cpu.sr.set(Status.Zero, cpu.load(param) == 0)
  cpu.sr.set(Status.Negative, cpu.load(param) >> 7)
}

export default bind
