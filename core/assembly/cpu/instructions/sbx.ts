import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xcb, sbx, Address.Immediate)
}

function sbx(cpu: Cpu, param: u16, mode: Address): void {
  cpu.x = (cpu.ac & cpu.x) - <u8>param
  cpu.setStatus(Status.Carry, cpu.x >= param)
  cpu.setStatus(Status.Zero, cpu.x == param)
  cpu.setStatus(Status.Negative, <bool>((cpu.x - param) >> 7))
}

export default bind
