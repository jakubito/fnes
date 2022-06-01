import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x28, plp, Address.Implied)
}

function plp(cpu: Cpu, value: u16, mode: Address): void {
  cpu.sr = cpu.pullFromStack()
}

export default bind
