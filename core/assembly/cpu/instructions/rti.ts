import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x40, rti, Address.Implied)
}

function rti(cpu: Cpu, value: u16, mode: Address): void {
  // TODO
}

export default bind
