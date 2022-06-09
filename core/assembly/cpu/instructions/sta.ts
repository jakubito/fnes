import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x85, sta, Mode.Zeropage, 3)
  cpu.bind(0x95, sta, Mode.ZeropageX, 4)
  cpu.bind(0x8d, sta, Mode.Absolute, 4)
  cpu.bind(0x9d, sta, Mode.AbsoluteX, 5)
  cpu.bind(0x99, sta, Mode.AbsoluteY, 5)
  cpu.bind(0x81, sta, Mode.IndirectX, 6)
  cpu.bind(0x91, sta, Mode.IndirectY, 6)
}

function sta(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.store(param, cpu.ac)
}

export default bind
