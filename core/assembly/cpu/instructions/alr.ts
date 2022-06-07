import Cpu from '../cpu'
import { Address } from '../enums'
import { lsrAc } from './lsr'

function bind(cpu: Cpu): void {
  cpu.bind(0x4b, alr, Address.Immediate, 2)
}

function alr(cpu: Cpu, param: u16, mode: Address): void {
  cpu.ac &= <u8>param
  lsrAc(cpu, 0, Address.Accumulator)
}

export default bind
