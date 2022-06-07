import Cpu from '../cpu'
import { Address, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x24, bit, Address.Zeropage, 3)
  cpu.bind(0x2c, bit, Address.Absolute, 4)
}

function bit(cpu: Cpu, param: u16, mode: Address): void {
  cpu.setStatus(Status.Zero, (cpu.ac & cpu.load(param)) == 0)
  cpu.setStatus(Status.Overflow, <bool>((cpu.load(param) >> 6) & 1))
  cpu.setStatus(Status.Negative, <bool>(cpu.load(param) >> 7))
}

export default bind
