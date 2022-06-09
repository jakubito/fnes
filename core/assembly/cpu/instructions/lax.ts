import Cpu from '../Cpu'
import { Mode } from '../enums'
import { lda } from './lda'
import { ldx } from './ldx'

function bind(cpu: Cpu): void {
  cpu.bind(0xa7, lax, Mode.Zeropage, 3)
  cpu.bind(0xb7, lax, Mode.ZeropageY, 4)
  cpu.bind(0xaf, lax, Mode.Absolute, 4)
  cpu.bind(0xbf, lax, Mode.AbsoluteY, 4, true)
  cpu.bind(0xa3, lax, Mode.IndirectX, 6)
  cpu.bind(0xb3, lax, Mode.IndirectY, 5, true)
}

function lax(cpu: Cpu, param: u16, mode: Mode): void {
  lda(cpu, param, mode)
  ldx(cpu, param, mode)
}

export default bind
