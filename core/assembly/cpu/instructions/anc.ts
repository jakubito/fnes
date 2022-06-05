import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x0b, anc, Address.Immediate)
  cpu.bind(0x2b, anc, Address.Immediate)
}

function anc(cpu: Cpu, value: u16, mode: Address): void {
  cpu.ac &= <u8>value
  cpu.setStatus(Status.Carry, <bool>(cpu.ac >> 7))
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
