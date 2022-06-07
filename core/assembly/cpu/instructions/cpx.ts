import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xe0, cpx, Address.Immediate, 2)
  cpu.bind(0xe4, cpx, Address.Zeropage, 3)
  cpu.bind(0xec, cpx, Address.Absolute, 4)
}

function cpx(cpu: Cpu, param: u16, mode: Address): void {
  const value = mode == Address.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Carry, cpu.x >= value)
  cpu.setStatus(Status.Zero, cpu.x == value)
  cpu.setStatus(Status.Negative, <bool>((cpu.x - value) >> 7))
}

export default bind
