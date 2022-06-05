import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xbb, las, Address.AbsoluteY)
}

function las(cpu: Cpu, value: u16, mode: Address): void {
  cpu.ac = cpu.x = cpu.sp = cpu.load(value) & cpu.sp
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
