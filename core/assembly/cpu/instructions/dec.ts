import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xc6, dec, Address.Zeropage)
  cpu.bind(0xd6, dec, Address.ZeropageX)
  cpu.bind(0xce, dec, Address.Absolute)
  cpu.bind(0xde, dec, Address.AbsoluteX)
}

function dec(cpu: Cpu, value: u16, mode: Address): void {
  cpu.store(value, cpu.load(value) - 1)
  cpu.setStatus(Status.Zero, cpu.load(value) == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.load(value) >> 7))
}

export default bind
