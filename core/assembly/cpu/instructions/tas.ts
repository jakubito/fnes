import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x9b, tas, Address.AbsoluteY)
}

function tas(cpu: Cpu, value: u16, mode: Address): void {
  cpu.sp = cpu.ac & cpu.x
  cpu.store(value, cpu.sp & (<u8>(value >> 8) + 1))
}

export default bind
