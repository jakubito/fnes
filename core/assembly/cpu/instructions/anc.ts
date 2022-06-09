import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x0b, anc, Mode.Immediate, 2)
  cpu.bind(0x2b, anc, Mode.Immediate, 2)
}

function anc(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.ac &= <u8>param
  cpu.setStatus(Status.Carry, cpu.ac >> 7)
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, cpu.ac >> 7)
}

export default bind
