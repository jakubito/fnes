import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xa9, lda, Mode.Immediate, 2)
  cpu.bind(0xa5, lda, Mode.Zeropage, 3)
  cpu.bind(0xb5, lda, Mode.ZeropageX, 4)
  cpu.bind(0xad, lda, Mode.Absolute, 4)
  cpu.bind(0xbd, lda, Mode.AbsoluteX, 4, true)
  cpu.bind(0xb9, lda, Mode.AbsoluteY, 4, true)
  cpu.bind(0xa1, lda, Mode.IndirectX, 6)
  cpu.bind(0xb1, lda, Mode.IndirectY, 5, true)
}

export function lda(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.ac = mode == Mode.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
