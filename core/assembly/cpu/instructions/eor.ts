import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x49, eor, Mode.Immediate, 2)
  cpu.bind(0x45, eor, Mode.Zeropage, 3)
  cpu.bind(0x55, eor, Mode.ZeropageX, 4)
  cpu.bind(0x4d, eor, Mode.Absolute, 4)
  cpu.bind(0x5d, eor, Mode.AbsoluteX, 4, true)
  cpu.bind(0x59, eor, Mode.AbsoluteY, 4, true)
  cpu.bind(0x41, eor, Mode.IndirectX, 6)
  cpu.bind(0x51, eor, Mode.IndirectY, 5, true)
}

export function eor(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.ac ^= mode == Mode.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, cpu.ac >> 7)
}

export default bind
