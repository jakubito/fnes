import Cpu from '../cpu'
import { Address } from '../enums'
import { lda } from './lda'
import { ldx } from './ldx'

function bind(cpu: Cpu): void {
  cpu.bind(0xa7, lax, Address.Zeropage)
  cpu.bind(0xb7, lax, Address.ZeropageY)
  cpu.bind(0xaf, lax, Address.Absolute)
  cpu.bind(0xbf, lax, Address.AbsoluteY)
  cpu.bind(0xa3, lax, Address.IndirectX)
  cpu.bind(0xb3, lax, Address.IndirectY)
}

function lax(cpu: Cpu, value: u16, mode: Address): void {
  lda(cpu, value, mode)
  ldx(cpu, value, mode)
}

export default bind
