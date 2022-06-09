import Cpu from '../Cpu'
import { Mode } from '../enums'
import { inc } from './inc'
import { sbc } from './sbc'

function bind(cpu: Cpu): void {
  cpu.bind(0xe7, isc, Mode.Zeropage, 5)
  cpu.bind(0xf7, isc, Mode.ZeropageX, 6)
  cpu.bind(0xef, isc, Mode.Absolute, 6)
  cpu.bind(0xff, isc, Mode.AbsoluteX, 7)
  cpu.bind(0xfb, isc, Mode.AbsoluteY, 7)
  cpu.bind(0xe3, isc, Mode.IndirectX, 8)
  cpu.bind(0xf3, isc, Mode.IndirectY, 8)
}

function isc(cpu: Cpu, param: u16, mode: Mode): void {
  inc(cpu, param, mode)
  sbc(cpu, param, mode)
}

export default bind
