import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xe6, inc, Address.Zeropage)
  cpu.bind(0xf6, inc, Address.ZeropageX)
  cpu.bind(0xee, inc, Address.Absolute)
  cpu.bind(0xfe, inc, Address.AbsoluteX)
}

export function inc(cpu: Cpu, value: u16, mode: Address): void {
  cpu.store(value, cpu.load(value) + 1)
  cpu.setStatus(Status.Zero, cpu.load(value) == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.load(value) >> 7))
}

export default bind
