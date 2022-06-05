import Cpu from '../cpu'
import { Address } from '../enums'
import { and } from './and'
import { rol } from './rol'

function bind(cpu: Cpu): void {
  cpu.bind(0x27, rla, Address.Zeropage)
  cpu.bind(0x37, rla, Address.ZeropageX)
  cpu.bind(0x2f, rla, Address.Absolute)
  cpu.bind(0x3f, rla, Address.AbsoluteX)
  cpu.bind(0x3b, rla, Address.AbsoluteY)
  cpu.bind(0x23, rla, Address.IndirectX)
  cpu.bind(0x33, rla, Address.IndirectY)
}

function rla(cpu: Cpu, value: u16, mode: Address): void {
  rol(cpu, value, mode)
  and(cpu, value, mode)
}

export default bind
