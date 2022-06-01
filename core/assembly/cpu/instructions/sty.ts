import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x84, sty, Address.Zeropage)
  cpu.bind(0x94, sty, Address.ZeropageX)
  cpu.bind(0x8c, sty, Address.Absolute)
}

function sty(cpu: Cpu, value: u16, mode: Address): void {
  cpu.store(value, cpu.y)
}

export default bind
