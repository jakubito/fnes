import { word } from '../../helpers'
import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x40, rti, Address.Implied)
}

function rti(cpu: Cpu, value: u16, mode: Address): void {
  cpu.sr = (cpu.sr & 0b0011_0000) | (cpu.pullFromStack() & 0b1100_1111)
  cpu.pc = word(cpu.pullFromStack(), cpu.pullFromStack())
}

export default bind
