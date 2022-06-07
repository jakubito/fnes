import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x86, stx, Address.Zeropage, 3)
  cpu.bind(0x96, stx, Address.ZeropageY, 4)
  cpu.bind(0x8e, stx, Address.Absolute, 4)
}

function stx(cpu: Cpu, param: u16, mode: Address): void {
  cpu.store(param, cpu.x)
}

export default bind
