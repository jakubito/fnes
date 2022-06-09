import Cpu from '../Cpu'
import { Mode } from '../enums'
import { dec } from './dec'
import { cmp } from './cmp'

function bind(cpu: Cpu): void {
  cpu.bind(0xc7, dcp, Mode.Zeropage, 5)
  cpu.bind(0xd7, dcp, Mode.ZeropageX, 6)
  cpu.bind(0xcf, dcp, Mode.Absolute, 6)
  cpu.bind(0xdf, dcp, Mode.AbsoluteX, 7)
  cpu.bind(0xdb, dcp, Mode.AbsoluteY, 7)
  cpu.bind(0xc3, dcp, Mode.IndirectX, 8)
  cpu.bind(0xd3, dcp, Mode.IndirectY, 8)
}

function dcp(cpu: Cpu, param: u16, mode: Mode): void {
  dec(cpu, param, mode)
  cmp(cpu, param, mode)
}

export default bind
