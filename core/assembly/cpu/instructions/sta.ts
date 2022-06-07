import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x85, sta, Address.Zeropage, 3)
  cpu.bind(0x95, sta, Address.ZeropageX, 4)
  cpu.bind(0x8d, sta, Address.Absolute, 4)
  cpu.bind(0x9d, sta, Address.AbsoluteX, 5)
  cpu.bind(0x99, sta, Address.AbsoluteY, 5)
  cpu.bind(0x81, sta, Address.IndirectX, 6)
  cpu.bind(0x91, sta, Address.IndirectY, 6)
}

function sta(cpu: Cpu, param: u16, mode: Address): void {
  cpu.store(param, cpu.ac)
}

export default bind
