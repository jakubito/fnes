import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xba, tsx, Address.Implied)
}

function tsx(cpu: Cpu, value: u16, mode: Address): void {
  cpu.x = cpu.sp
  cpu.setStatus(Status.Zero, cpu.x == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.x >> 7))
}

export default bind
