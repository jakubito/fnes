import Cpu from '../cpu'
import { Address } from '../enums'
import { adc } from './adc'
import { ror } from './ror'

function bind(cpu: Cpu): void {
  cpu.bind(0x67, rra, Address.Zeropage)
  cpu.bind(0x77, rra, Address.ZeropageX)
  cpu.bind(0x6f, rra, Address.Absolute)
  cpu.bind(0x7f, rra, Address.AbsoluteX)
  cpu.bind(0x7b, rra, Address.AbsoluteY)
  cpu.bind(0x63, rra, Address.IndirectX)
  cpu.bind(0x73, rra, Address.IndirectY)
}

function rra(cpu: Cpu, value: u16, mode: Address): void {
  ror(cpu, value, mode)
  adc(cpu, value, mode)
}

export default bind
