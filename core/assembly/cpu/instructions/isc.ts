import Cpu from '../cpu'
import { Address } from '../enums'
import { inc } from './inc'
import { sbc } from './sbc'

function bind(cpu: Cpu): void {
  cpu.bind(0xe7, isc, Address.Zeropage, 5)
  cpu.bind(0xf7, isc, Address.ZeropageX, 6)
  cpu.bind(0xef, isc, Address.Absolute, 6)
  cpu.bind(0xff, isc, Address.AbsoluteX, 7)
  cpu.bind(0xfb, isc, Address.AbsoluteY, 7)
  cpu.bind(0xe3, isc, Address.IndirectX, 8)
  cpu.bind(0xf3, isc, Address.IndirectY, 8)
}

function isc(cpu: Cpu, param: u16, mode: Address): void {
  inc(cpu, param, mode)
  sbc(cpu, param, mode)
}

export default bind
