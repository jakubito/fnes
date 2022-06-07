import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x9e, shx, Address.AbsoluteY, 5)
}

function shx(cpu: Cpu, param: u16, mode: Address): void {
  cpu.store(param, cpu.x & (<u8>(param >> 8) + 1))
}

export default bind
