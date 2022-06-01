import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x48, pha, Address.Implied)
}

function pha(cpu: Cpu, value: u16, mode: Address): void {
  cpu.pushToStack(cpu.ac)
}

export default bind
