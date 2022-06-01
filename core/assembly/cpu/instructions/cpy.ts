import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xc0, cpy, Address.Immediate)
  cpu.bind(0xc4, cpy, Address.Zeropage)
  cpu.bind(0xcc, cpy, Address.Absolute)
}

function cpy(cpu: Cpu, value: u16, mode: Address): void {
  const val = mode == Address.Immediate ? <u8>value : cpu.load(value)
  cpu.setStatus(Status.Carry, cpu.y >= val)
  cpu.setStatus(Status.Zero, cpu.y == val)
  cpu.setStatus(Status.Negative, <bool>((cpu.y - val) >> 7))
}

export default bind
