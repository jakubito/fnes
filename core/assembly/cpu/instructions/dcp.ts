import Cpu from '../cpu'
import { Address } from '../enums'
import { dec } from './dec'
import { cmp } from './cmp'

function bind(cpu: Cpu): void {
  cpu.bind(0xc7, dcp, Address.Zeropage, 5)
  cpu.bind(0xd7, dcp, Address.ZeropageX, 6)
  cpu.bind(0xcf, dcp, Address.Absolute, 6)
  cpu.bind(0xdf, dcp, Address.AbsoluteX, 7)
  cpu.bind(0xdb, dcp, Address.AbsoluteY, 7)
  cpu.bind(0xc3, dcp, Address.IndirectX, 8)
  cpu.bind(0xd3, dcp, Address.IndirectY, 8)
}

function dcp(cpu: Cpu, param: u16, mode: Address): void {
  dec(cpu, param, mode)
  cmp(cpu, param, mode)
}

export default bind
