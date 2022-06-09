import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xc0, cpy, Mode.Immediate, 2)
  cpu.bind(0xc4, cpy, Mode.Zeropage, 3)
  cpu.bind(0xcc, cpy, Mode.Absolute, 4)
}

function cpy(cpu: Cpu, param: u16, mode: Mode): void {
  const value = mode == Mode.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Carry, cpu.y >= value)
  cpu.setStatus(Status.Zero, cpu.y == value)
  cpu.setStatus(Status.Negative, (cpu.y - value) >> 7)
}

export default bind
