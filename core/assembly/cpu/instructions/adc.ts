import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x69, adc, Mode.Immediate, 2)
  cpu.bind(0x65, adc, Mode.Zeropage, 3)
  cpu.bind(0x75, adc, Mode.ZeropageX, 4)
  cpu.bind(0x6d, adc, Mode.Absolute, 4)
  cpu.bind(0x7d, adc, Mode.AbsoluteX, 4, true)
  cpu.bind(0x79, adc, Mode.AbsoluteY, 4, true)
  cpu.bind(0x61, adc, Mode.IndirectX, 6)
  cpu.bind(0x71, adc, Mode.IndirectY, 5, true)
}

export function adc(cpu: Cpu, param: u16, mode: Mode): void {
  const value = mode == Mode.Immediate ? <u8>param : cpu.load(param)
  const sum = <u16>cpu.ac + value + <u8>cpu.getStatus(Status.Carry)
  const overflow = ~(cpu.ac ^ value) & (cpu.ac ^ sum) & 0b1000_0000
  cpu.ac = <u8>sum
  cpu.setStatus(Status.Carry, sum > 0xff)
  cpu.setStatus(Status.Zero, cpu.ac == 0)
  cpu.setStatus(Status.Overflow, overflow)
  cpu.setStatus(Status.Negative, cpu.ac >> 7)
}

export default bind
