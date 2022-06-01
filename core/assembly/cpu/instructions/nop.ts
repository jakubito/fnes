import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xea, nop, Address.Implied)
}

function nop(cpu: Cpu, value: u16, mode: Address): void {}

export default bind
