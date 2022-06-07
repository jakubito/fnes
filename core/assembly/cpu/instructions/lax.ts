import Cpu from '../cpu'
import { Address } from '../enums'
import { lda } from './lda'
import { ldx } from './ldx'

function bind(cpu: Cpu): void {
  cpu.bind(0xa7, lax, Address.Zeropage, 3)
  cpu.bind(0xb7, lax, Address.ZeropageY, 4)
  cpu.bind(0xaf, lax, Address.Absolute, 4)
  cpu.bind(0xbf, lax, Address.AbsoluteY, 4, true)
  cpu.bind(0xa3, lax, Address.IndirectX, 6)
  cpu.bind(0xb3, lax, Address.IndirectY, 5, true)
}

function lax(cpu: Cpu, param: u16, mode: Address): void {
  lda(cpu, param, mode)
  ldx(cpu, param, mode)
}

export default bind
