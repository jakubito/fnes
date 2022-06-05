import { word } from '../../helpers'
import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x60, rts, Address.Implied)
}

function rts(cpu: Cpu, value: u16, mode: Address): void {
  cpu.pc = word(cpu.pullFromStack(), cpu.pullFromStack()) + 1
}

export default bind
