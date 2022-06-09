import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xa0, ldy, Mode.Immediate, 2)
  cpu.bind(0xa4, ldy, Mode.Zeropage, 3)
  cpu.bind(0xb4, ldy, Mode.ZeropageX, 4)
  cpu.bind(0xac, ldy, Mode.Absolute, 4)
  cpu.bind(0xbc, ldy, Mode.AbsoluteX, 4, true)
}

function ldy(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.y = mode == Mode.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Zero, cpu.y == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.y >> 7))
}

export default bind
