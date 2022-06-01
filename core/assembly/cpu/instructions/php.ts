import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x08, php, Address.Implied)
}

function php(cpu: Cpu, value: u16, mode: Address): void {
  cpu.pushToStack(cpu.sr)
}

export default bind
