import Cpu from '../cpu'
import { Address } from '../enums'
import { inc } from './inc'
import { sbc } from './sbc'

function bind(cpu: Cpu): void {
  cpu.bind(0xe7, isc, Address.Zeropage)
  cpu.bind(0xf7, isc, Address.ZeropageX)
  cpu.bind(0xef, isc, Address.Absolute)
  cpu.bind(0xff, isc, Address.AbsoluteX)
  cpu.bind(0xfb, isc, Address.AbsoluteY)
  cpu.bind(0xe3, isc, Address.IndirectX)
  cpu.bind(0xf3, isc, Address.IndirectY)
}

function isc(cpu: Cpu, param: u16, mode: Address): void {
  inc(cpu, param, mode)
  sbc(cpu, param, mode)
}

export default bind
