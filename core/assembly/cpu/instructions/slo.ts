import Cpu from '../cpu'
import { Address } from '../enums'
import { asl } from './asl'
import { ora } from './ora'

function bind(cpu: Cpu): void {
  cpu.bind(0x07, slo, Address.Zeropage, 5)
  cpu.bind(0x17, slo, Address.ZeropageX, 6)
  cpu.bind(0x0f, slo, Address.Absolute, 6)
  cpu.bind(0x1f, slo, Address.AbsoluteX, 7)
  cpu.bind(0x1b, slo, Address.AbsoluteY, 7)
  cpu.bind(0x03, slo, Address.IndirectX, 8)
  cpu.bind(0x13, slo, Address.IndirectY, 8)
}

function slo(cpu: Cpu, param: u16, mode: Address): void {
  asl(cpu, param, mode)
  ora(cpu, param, mode)
}

export default bind
