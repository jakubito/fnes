import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x28, plp, Address.Implied, 4)
}

function plp(cpu: Cpu, param: u16, mode: Address): void {
  cpu.sr = (cpu.sr & 0b0011_0000) | (cpu.pullFromStack() & 0b1100_1111)
}

export default bind
