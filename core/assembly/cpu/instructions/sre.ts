import Cpu from '../Cpu'
import { Mode } from '../enums'
import { eor } from './eor'
import { lsr } from './lsr'

function bind(cpu: Cpu): void {
  cpu.bind(0x47, sre, Mode.Zeropage, 5)
  cpu.bind(0x57, sre, Mode.ZeropageX, 6)
  cpu.bind(0x4f, sre, Mode.Absolute, 6)
  cpu.bind(0x5f, sre, Mode.AbsoluteX, 7)
  cpu.bind(0x5b, sre, Mode.AbsoluteY, 7)
  cpu.bind(0x43, sre, Mode.IndirectX, 8)
  cpu.bind(0x53, sre, Mode.IndirectY, 8)
}

function sre(cpu: Cpu, param: u16, mode: Mode): void {
  lsr(cpu, param, mode)
  eor(cpu, param, mode)
}

export default bind
