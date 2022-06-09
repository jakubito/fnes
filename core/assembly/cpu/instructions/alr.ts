import Cpu from '../Cpu'
import { Mode } from '../enums'
import { lsrAc } from './lsr'

function bind(cpu: Cpu): void {
  cpu.bind(0x4b, alr, Mode.Immediate, 2)
}

function alr(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.ac &= <u8>param
  lsrAc(cpu, 0, Mode.Accumulator)
}

export default bind
