import Cpu from '../cpu'
import { Address } from '../enums'
import { eor } from './eor'
import { lsr } from './lsr'

function bind(cpu: Cpu): void {
  cpu.bind(0x47, sre, Address.Zeropage)
  cpu.bind(0x57, sre, Address.ZeropageX)
  cpu.bind(0x4f, sre, Address.Absolute)
  cpu.bind(0x5f, sre, Address.AbsoluteX)
  cpu.bind(0x5b, sre, Address.AbsoluteY)
  cpu.bind(0x43, sre, Address.IndirectX)
  cpu.bind(0x53, sre, Address.IndirectY)
}

function sre(cpu: Cpu, value: u16, mode: Address): void {
  lsr(cpu, value, mode)
  eor(cpu, value, mode)
}

export default bind
