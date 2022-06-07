import Cpu from '../cpu'
import { Address } from '../enums'
import { eor } from './eor'
import { lsr } from './lsr'

function bind(cpu: Cpu): void {
  cpu.bind(0x47, sre, Address.Zeropage, 5)
  cpu.bind(0x57, sre, Address.ZeropageX, 6)
  cpu.bind(0x4f, sre, Address.Absolute, 6)
  cpu.bind(0x5f, sre, Address.AbsoluteX, 7)
  cpu.bind(0x5b, sre, Address.AbsoluteY, 7)
  cpu.bind(0x43, sre, Address.IndirectX, 8)
  cpu.bind(0x53, sre, Address.IndirectY, 8)
}

function sre(cpu: Cpu, param: u16, mode: Address): void {
  lsr(cpu, param, mode)
  eor(cpu, param, mode)
}

export default bind
