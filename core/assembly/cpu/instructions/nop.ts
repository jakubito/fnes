import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xea, nop, Address.Implied)
  cpu.bind(0x1a, nop, Address.Implied)
  cpu.bind(0x3a, nop, Address.Implied)
  cpu.bind(0x5a, nop, Address.Implied)
  cpu.bind(0x7a, nop, Address.Implied)
  cpu.bind(0xda, nop, Address.Implied)
  cpu.bind(0xfa, nop, Address.Implied)
  cpu.bind(0x80, nop, Address.Immediate)
  cpu.bind(0x82, nop, Address.Immediate)
  cpu.bind(0x89, nop, Address.Immediate)
  cpu.bind(0xc2, nop, Address.Immediate)
  cpu.bind(0xe2, nop, Address.Immediate)
  cpu.bind(0x04, nop, Address.Zeropage)
  cpu.bind(0x44, nop, Address.Zeropage)
  cpu.bind(0x64, nop, Address.Zeropage)
  cpu.bind(0x14, nop, Address.ZeropageX)
  cpu.bind(0x34, nop, Address.ZeropageX)
  cpu.bind(0x54, nop, Address.ZeropageX)
  cpu.bind(0x74, nop, Address.ZeropageX)
  cpu.bind(0xd4, nop, Address.ZeropageX)
  cpu.bind(0xf4, nop, Address.ZeropageX)
  cpu.bind(0x0c, nop, Address.Absolute)
  cpu.bind(0x1c, nop, Address.AbsoluteX)
  cpu.bind(0x3c, nop, Address.AbsoluteX)
  cpu.bind(0x5c, nop, Address.AbsoluteX)
  cpu.bind(0x7c, nop, Address.AbsoluteX)
  cpu.bind(0xdc, nop, Address.AbsoluteX)
  cpu.bind(0xfc, nop, Address.AbsoluteX)
}

function nop(cpu: Cpu, param: u16, mode: Address): void {}

export default bind
