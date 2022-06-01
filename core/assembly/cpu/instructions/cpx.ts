import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xe0, cpx, Address.Immediate)
  cpu.bind(0xe4, cpx, Address.Zeropage)
  cpu.bind(0xec, cpx, Address.Absolute)
}

function cpx(cpu: Cpu, value: u16, mode: Address): void {
  const val = mode == Address.Immediate ? <u8>value : cpu.load(value)
  cpu.setStatus(Status.Carry, cpu.x >= val)
  cpu.setStatus(Status.Zero, cpu.x == val)
  cpu.setStatus(Status.Negative, <bool>((cpu.x - val) >> 7))
}

export default bind
