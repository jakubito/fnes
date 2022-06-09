import Cpu from '../Cpu'
import { Mode } from '../enums'
import { and } from './and'
import { rol } from './rol'

function bind(cpu: Cpu): void {
  cpu.bind(0x27, rla, Mode.Zeropage, 5)
  cpu.bind(0x37, rla, Mode.ZeropageX, 6)
  cpu.bind(0x2f, rla, Mode.Absolute, 6)
  cpu.bind(0x3f, rla, Mode.AbsoluteX, 7)
  cpu.bind(0x3b, rla, Mode.AbsoluteY, 7)
  cpu.bind(0x23, rla, Mode.IndirectX, 8)
  cpu.bind(0x33, rla, Mode.IndirectY, 8)
}

function rla(cpu: Cpu, param: u16, mode: Mode): void {
  rol(cpu, param, mode)
  and(cpu, param, mode)
}

export default bind
