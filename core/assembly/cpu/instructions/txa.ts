import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x8a, txa, Mode.Implied, 2)
}

function txa(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.ac = cpu.x
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
