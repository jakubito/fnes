import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x85, sta, Address.Zeropage)
  cpu.bind(0x95, sta, Address.ZeropageX)
  cpu.bind(0x8d, sta, Address.Absolute)
  cpu.bind(0x9d, sta, Address.AbsoluteX)
  cpu.bind(0x99, sta, Address.AbsoluteY)
  cpu.bind(0x81, sta, Address.IndirectX)
  cpu.bind(0x91, sta, Address.IndirectY)
}

function sta(cpu: Cpu, value: u16, mode: Address): void {
  cpu.store(value, cpu.ac)
}

export default bind
