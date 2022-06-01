import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x9a, txs, Address.Implied)
}

function txs(cpu: Cpu, value: u16, mode: Address): void {
  cpu.sp = cpu.x
}

export default bind
