import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x24, bit, Address.Zeropage)
  cpu.bind(0x2c, bit, Address.Absolute)
}

function bit(cpu: Cpu, value: u16, mode: Address): void {
  cpu.setStatus(Status.Zero, (cpu.ac & value) == 0)
  cpu.setStatus(Status.Overflow, <bool>(value >> 6))
  cpu.setStatus(Status.Negative, <bool>(value >> 7))
}

export default bind
