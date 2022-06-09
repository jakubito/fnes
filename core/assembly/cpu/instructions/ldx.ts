import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xa2, ldx, Mode.Immediate, 2)
  cpu.bind(0xa6, ldx, Mode.Zeropage, 3)
  cpu.bind(0xb6, ldx, Mode.ZeropageY, 4)
  cpu.bind(0xae, ldx, Mode.Absolute, 4)
  cpu.bind(0xbe, ldx, Mode.AbsoluteY, 4, true)
}

export function ldx(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.x = mode == Mode.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Zero, cpu.x == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.x >> 7))
}

export default bind
