import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xc0, cpy, Address.Immediate, 2)
  cpu.bind(0xc4, cpy, Address.Zeropage, 3)
  cpu.bind(0xcc, cpy, Address.Absolute, 4)
}

function cpy(cpu: Cpu, param: u16, mode: Address): void {
  const value = mode == Address.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Carry, cpu.y >= value)
  cpu.setStatus(Status.Zero, cpu.y == value)
  cpu.setStatus(Status.Negative, <bool>((cpu.y - value) >> 7))
}

export default bind
