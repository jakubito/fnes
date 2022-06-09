import Cpu from '../Cpu'
import { Mode, Status } from '../enums'
import { rorAc } from './ror'

function bind(cpu: Cpu): void {
  cpu.bind(0x6b, arr, Mode.Immediate, 2)
}

function arr(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.ac &= <u8>param
  rorAc(cpu, 0, Mode.Accumulator)
  cpu.setStatus(Status.Carry, (cpu.ac >> 6) & 1)
  cpu.setStatus(Status.Overflow, ((cpu.ac >> 6) & 1) ^ ((cpu.ac >> 5) & 1))
}

export default bind
