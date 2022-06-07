import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xc6, dec, Address.Zeropage, 5)
  cpu.bind(0xd6, dec, Address.ZeropageX, 6)
  cpu.bind(0xce, dec, Address.Absolute, 6)
  cpu.bind(0xde, dec, Address.AbsoluteX, 7)
}

export function dec(cpu: Cpu, param: u16, mode: Address): void {
  cpu.store(param, cpu.load(param) - 1)
  cpu.setStatus(Status.Zero, cpu.load(param) == 0)
  cpu.setStatus(Status.Negative, <bool>(cpu.load(param) >> 7))
}

export default bind
