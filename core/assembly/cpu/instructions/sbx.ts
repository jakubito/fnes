import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xcb, sbx, Address.Immediate)
}

function sbx(cpu: Cpu, value: u16, mode: Address): void {
  cpu.x = (cpu.ac & cpu.x) - <u8>value
  cpu.setStatus(Status.Carry, cpu.x >= value)
  cpu.setStatus(Status.Zero, cpu.x == value)
  cpu.setStatus(Status.Negative, <bool>((cpu.x - value) >> 7))
}

export default bind
