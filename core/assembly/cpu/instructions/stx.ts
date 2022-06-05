import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x86, stx, Address.Zeropage)
  cpu.bind(0x96, stx, Address.ZeropageY)
  cpu.bind(0x8e, stx, Address.Absolute)
}

function stx(cpu: Cpu, param: u16, mode: Address): void {
  cpu.store(param, cpu.x)
}

export default bind
