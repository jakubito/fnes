import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x84, sty, Mode.Zeropage, 3)
  cpu.bind(0x94, sty, Mode.ZeropageX, 4)
  cpu.bind(0x8c, sty, Mode.Absolute, 4)
}

function sty(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.store(param, cpu.y)
}

export default bind
