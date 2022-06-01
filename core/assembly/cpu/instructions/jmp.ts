import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x4c, jmp, Address.Absolute)
  cpu.bind(0x6c, jmp, Address.Indirect)
}

function jmp(cpu: Cpu, value: u16, mode: Address): void {
  cpu.pc = value
}

export default bind
