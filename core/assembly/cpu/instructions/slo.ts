import Cpu from '../cpu'
import { Address } from '../enums'
import { asl } from './asl'
import { ora } from './ora'

function bind(cpu: Cpu): void {
  cpu.bind(0x07, slo, Address.Zeropage)
  cpu.bind(0x17, slo, Address.ZeropageX)
  cpu.bind(0x0f, slo, Address.Absolute)
  cpu.bind(0x1f, slo, Address.AbsoluteX)
  cpu.bind(0x1b, slo, Address.AbsoluteY)
  cpu.bind(0x03, slo, Address.IndirectX)
  cpu.bind(0x13, slo, Address.IndirectY)
}

function slo(cpu: Cpu, param: u16, mode: Address): void {
  asl(cpu, param, mode)
  ora(cpu, param, mode)
}

export default bind
