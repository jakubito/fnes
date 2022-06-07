import Cpu from '../cpu'
import { Address } from '../enums'
import { adc } from './adc'
import { ror } from './ror'

function bind(cpu: Cpu): void {
  cpu.bind(0x67, rra, Address.Zeropage, 5)
  cpu.bind(0x77, rra, Address.ZeropageX, 6)
  cpu.bind(0x6f, rra, Address.Absolute, 6)
  cpu.bind(0x7f, rra, Address.AbsoluteX, 7)
  cpu.bind(0x7b, rra, Address.AbsoluteY, 7)
  cpu.bind(0x63, rra, Address.IndirectX, 8)
  cpu.bind(0x73, rra, Address.IndirectY, 8)
}

function rra(cpu: Cpu, param: u16, mode: Address): void {
  ror(cpu, param, mode)
  adc(cpu, param, mode)
}

export default bind
