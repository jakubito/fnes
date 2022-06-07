import Cpu from '../cpu'
import { Address } from '../enums'
import { and } from './and'
import { rol } from './rol'

function bind(cpu: Cpu): void {
  cpu.bind(0x27, rla, Address.Zeropage, 5)
  cpu.bind(0x37, rla, Address.ZeropageX, 6)
  cpu.bind(0x2f, rla, Address.Absolute, 6)
  cpu.bind(0x3f, rla, Address.AbsoluteX, 7)
  cpu.bind(0x3b, rla, Address.AbsoluteY, 7)
  cpu.bind(0x23, rla, Address.IndirectX, 8)
  cpu.bind(0x33, rla, Address.IndirectY, 8)
}

function rla(cpu: Cpu, param: u16, mode: Address): void {
  rol(cpu, param, mode)
  and(cpu, param, mode)
}

export default bind
