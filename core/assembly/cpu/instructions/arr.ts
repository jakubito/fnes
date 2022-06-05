import Cpu from '../cpu'
import { Address, Status } from '../enums'
import { rorAc } from './ror'

function bind(cpu: Cpu): void {
  cpu.bind(0x6b, arr, Address.Immediate)
}

function arr(cpu: Cpu, param: u16, mode: Address): void {
  cpu.ac &= <u8>param
  rorAc(cpu, 0, Address.Accumulator)
  cpu.setStatus(Status.Carry, <bool>((cpu.ac >> 6) & 1))
  cpu.setStatus(Status.Overflow, <bool>(((cpu.ac >> 6) & 1) ^ ((cpu.ac >> 5) & 1)))
}

export default bind
