import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xa9, lda, Address.Immediate)
  cpu.bind(0xa5, lda, Address.Zeropage)
  cpu.bind(0xb5, lda, Address.ZeropageX)
  cpu.bind(0xad, lda, Address.Absolute)
  cpu.bind(0xbd, lda, Address.AbsoluteX)
  cpu.bind(0xb9, lda, Address.AbsoluteY)
  cpu.bind(0xa1, lda, Address.IndirectX)
  cpu.bind(0xb1, lda, Address.IndirectY)
}

export function lda(cpu: Cpu, param: u16, mode: Address): void {
  cpu.ac = mode == Address.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
