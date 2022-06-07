import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xa9, lda, Address.Immediate, 2)
  cpu.bind(0xa5, lda, Address.Zeropage, 3)
  cpu.bind(0xb5, lda, Address.ZeropageX, 4)
  cpu.bind(0xad, lda, Address.Absolute, 4)
  cpu.bind(0xbd, lda, Address.AbsoluteX, 4, true)
  cpu.bind(0xb9, lda, Address.AbsoluteY, 4, true)
  cpu.bind(0xa1, lda, Address.IndirectX, 6)
  cpu.bind(0xb1, lda, Address.IndirectY, 5, true)
}

export function lda(cpu: Cpu, param: u16, mode: Address): void {
  cpu.ac = mode == Address.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.ac >> 7))
}

export default bind
