import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xe6, inc, Address.Zeropage, 5)
  cpu.bind(0xf6, inc, Address.ZeropageX, 6)
  cpu.bind(0xee, inc, Address.Absolute, 6)
  cpu.bind(0xfe, inc, Address.AbsoluteX, 7)
}

export function inc(cpu: Cpu, param: u16, mode: Address): void {
  cpu.store(param, cpu.load(param) + 1)
  cpu.setStatus(Status.Zero, cpu.load(param) == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.load(param) >> 7))
}

export default bind
