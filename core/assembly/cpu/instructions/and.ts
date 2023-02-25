import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x29, and, Mode.Immediate, 2)
  cpu.bind(0x25, and, Mode.Zeropage, 3)
  cpu.bind(0x35, and, Mode.ZeropageX, 4)
  cpu.bind(0x2d, and, Mode.Absolute, 4)
  cpu.bind(0x3d, and, Mode.AbsoluteX, 4, true)
  cpu.bind(0x39, and, Mode.AbsoluteY, 4, true)
  cpu.bind(0x21, and, Mode.IndirectX, 6)
  cpu.bind(0x31, and, Mode.IndirectY, 5, true)
}

export function and(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.ac &= mode == Mode.Immediate ? <u8>param : cpu.load(param)
  cpu.sr.set(Status.Zero, cpu.ac == 0)
  cpu.sr.set(Status.Negative, cpu.ac >> 7)
}

export default bind
