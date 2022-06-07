import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x48, pha, Address.Implied, 3)
}

function pha(cpu: Cpu, param: u16, mode: Address): void {
  cpu.pushToStack(cpu.ac)
}

export default bind
