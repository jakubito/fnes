import Cpu from '../Cpu'
import { Mode } from '../enums'
import { asl } from './asl'
import { ora } from './ora'

function bind(cpu: Cpu): void {
  cpu.bind(0x07, slo, Mode.Zeropage, 5)
  cpu.bind(0x17, slo, Mode.ZeropageX, 6)
  cpu.bind(0x0f, slo, Mode.Absolute, 6)
  cpu.bind(0x1f, slo, Mode.AbsoluteX, 7)
  cpu.bind(0x1b, slo, Mode.AbsoluteY, 7)
  cpu.bind(0x03, slo, Mode.IndirectX, 8)
  cpu.bind(0x13, slo, Mode.IndirectY, 8)
}

function slo(cpu: Cpu, param: u16, mode: Mode): void {
  asl(cpu, param, mode)
  ora(cpu, param, mode)
}

export default bind
