import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x20, jsr, Address.Absolute)
}

function jsr(cpu: Cpu, value: u16, mode: Address): void {
  cpu.pushToStack(<u8>((cpu.pc - 1) >> 8))
  cpu.pushToStack(<u8>cpu.pc - 1)
  cpu.pc = value
}

export default bind
