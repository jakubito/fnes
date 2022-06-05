import Cpu from '../cpu'
import { Address } from '../enums'
import { lsrAc } from './lsr'

function bind(cpu: Cpu): void {
  cpu.bind(0x4b, alr, Address.Immediate)
}

function alr(cpu: Cpu, value: u16, mode: Address): void {
  cpu.ac &= <u8>value
  lsrAc(cpu, 0, Address.Accumulator)
}

export default bind
