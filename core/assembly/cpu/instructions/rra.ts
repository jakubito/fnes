import Cpu from '../Cpu'
import { Mode } from '../enums'
import { adc } from './adc'
import { ror } from './ror'

function bind(cpu: Cpu): void {
  cpu.bind(0x67, rra, Mode.Zeropage, 5)
  cpu.bind(0x77, rra, Mode.ZeropageX, 6)
  cpu.bind(0x6f, rra, Mode.Absolute, 6)
  cpu.bind(0x7f, rra, Mode.AbsoluteX, 7)
  cpu.bind(0x7b, rra, Mode.AbsoluteY, 7)
  cpu.bind(0x63, rra, Mode.IndirectX, 8)
  cpu.bind(0x73, rra, Mode.IndirectY, 8)
}

function rra(cpu: Cpu, param: u16, mode: Mode): void {
  ror(cpu, param, mode)
  adc(cpu, param, mode)
}

export default bind
