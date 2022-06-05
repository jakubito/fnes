import Cpu from '../cpu'
import { Address } from '../enums'
import { dec } from './dec'
import { cmp } from './cmp'

function bind(cpu: Cpu): void {
  cpu.bind(0xc7, dcp, Address.Zeropage)
  cpu.bind(0xd7, dcp, Address.ZeropageX)
  cpu.bind(0xcf, dcp, Address.Absolute)
  cpu.bind(0xdf, dcp, Address.AbsoluteX)
  cpu.bind(0xdb, dcp, Address.AbsoluteY)
  cpu.bind(0xc3, dcp, Address.IndirectX)
  cpu.bind(0xd3, dcp, Address.IndirectY)
}

function dcp(cpu: Cpu, value: u16, mode: Address): void {
  dec(cpu, value, mode)
  cmp(cpu, value, mode)
}

export default bind
