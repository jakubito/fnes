import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x9c, shy, Address.AbsoluteX)
}

function shy(cpu: Cpu, value: u16, mode: Address): void {
  cpu.store(value, cpu.y & (<u8>(value >> 8) + 1))
}

export default bind
