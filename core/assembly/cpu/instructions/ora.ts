import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x09, ora, Mode.Immediate, 2)
  cpu.bind(0x05, ora, Mode.Zeropage, 3)
  cpu.bind(0x15, ora, Mode.ZeropageX, 4)
  cpu.bind(0x0d, ora, Mode.Absolute, 4)
  cpu.bind(0x1d, ora, Mode.AbsoluteX, 4, true)
  cpu.bind(0x19, ora, Mode.AbsoluteY, 4, true)
  cpu.bind(0x01, ora, Mode.IndirectX, 6)
  cpu.bind(0x11, ora, Mode.IndirectY, 5, true)
}

export function ora(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.ac |= mode == Mode.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
