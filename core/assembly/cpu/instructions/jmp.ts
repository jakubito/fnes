import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x4c, jmp, Address.Absolute, 3)
  cpu.bind(0x6c, jmp, Address.Indirect, 5)
}

function jmp(cpu: Cpu, param: u16, mode: Address): void {
  cpu.pc = param
}

export default bind
