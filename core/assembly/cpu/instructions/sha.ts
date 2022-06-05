import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x9f, sha, Address.AbsoluteY)
  cpu.bind(0x93, sha, Address.IndirectY)
}

function sha(cpu: Cpu, value: u16, mode: Address): void {
  cpu.store(value, cpu.ac & cpu.x & (<u8>(value >> 8) + 1))
}

export default bind
