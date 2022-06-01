import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x86, stx, Address.Zeropage)
  cpu.bind(0x96, stx, Address.ZeropageY)
  cpu.bind(0x8e, stx, Address.Absolute)
}

function stx(cpu: Cpu, value: u16, mode: Address): void {
  cpu.store(value, cpu.x)
}

export default bind
