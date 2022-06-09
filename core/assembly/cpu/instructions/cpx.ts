import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xe0, cpx, Mode.Immediate, 2)
  cpu.bind(0xe4, cpx, Mode.Zeropage, 3)
  cpu.bind(0xec, cpx, Mode.Absolute, 4)
}

function cpx(cpu: Cpu, param: u16, mode: Mode): void {
  const value = mode == Mode.Immediate ? <u8>param : cpu.load(param)
  cpu.setStatus(Status.Carry, cpu.x >= value)
  cpu.setStatus(Status.Zero, cpu.x == value)
  cpu.setStatus(Status.Negative, (cpu.x - value) >> 7)
}

export default bind
