import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xc9, cmp, Mode.Immediate, 2)
  cpu.bind(0xc5, cmp, Mode.Zeropage, 3)
  cpu.bind(0xd5, cmp, Mode.ZeropageX, 4)
  cpu.bind(0xcd, cmp, Mode.Absolute, 4)
  cpu.bind(0xdd, cmp, Mode.AbsoluteX, 4, true)
  cpu.bind(0xd9, cmp, Mode.AbsoluteY, 4, true)
  cpu.bind(0xc1, cmp, Mode.IndirectX, 6)
  cpu.bind(0xd1, cmp, Mode.IndirectY, 5, true)
}

export function cmp(cpu: Cpu, param: u16, mode: Mode): void {
  const value = mode == Mode.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Carry, cpu.ac >= value)
  cpu.setStatus(Status.Zero, cpu.ac == value)
  cpu.setStatus(Status.Negative, <bool>((cpu.ac - value) >> 7))
}

export default bind
