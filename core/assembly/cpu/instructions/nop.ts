import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xea, nop, Mode.Implied, 2)
  cpu.bind(0x1a, nop, Mode.Implied, 2)
  cpu.bind(0x3a, nop, Mode.Implied, 2)
  cpu.bind(0x5a, nop, Mode.Implied, 2)
  cpu.bind(0x7a, nop, Mode.Implied, 2)
  cpu.bind(0xda, nop, Mode.Implied, 2)
  cpu.bind(0xfa, nop, Mode.Implied, 2)
  cpu.bind(0x80, nop, Mode.Immediate, 2)
  cpu.bind(0x82, nop, Mode.Immediate, 2)
  cpu.bind(0x89, nop, Mode.Immediate, 2)
  cpu.bind(0xc2, nop, Mode.Immediate, 2)
  cpu.bind(0xe2, nop, Mode.Immediate, 2)
  cpu.bind(0x04, nop, Mode.Zeropage, 3)
  cpu.bind(0x44, nop, Mode.Zeropage, 3)
  cpu.bind(0x64, nop, Mode.Zeropage, 3)
  cpu.bind(0x14, nop, Mode.ZeropageX, 4)
  cpu.bind(0x34, nop, Mode.ZeropageX, 4)
  cpu.bind(0x54, nop, Mode.ZeropageX, 4)
  cpu.bind(0x74, nop, Mode.ZeropageX, 4)
  cpu.bind(0xd4, nop, Mode.ZeropageX, 4)
  cpu.bind(0xf4, nop, Mode.ZeropageX, 4)
  cpu.bind(0x0c, nop, Mode.Absolute, 4)
  cpu.bind(0x1c, nop, Mode.AbsoluteX, 4, true)
  cpu.bind(0x3c, nop, Mode.AbsoluteX, 4, true)
  cpu.bind(0x5c, nop, Mode.AbsoluteX, 4, true)
  cpu.bind(0x7c, nop, Mode.AbsoluteX, 4, true)
  cpu.bind(0xdc, nop, Mode.AbsoluteX, 4, true)
  cpu.bind(0xfc, nop, Mode.AbsoluteX, 4, true)
}

function nop(cpu: Cpu, param: u16, mode: Mode): void {}

export default bind
