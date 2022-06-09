import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x24, bit, Mode.Zeropage, 3)
  cpu.bind(0x2c, bit, Mode.Absolute, 4)
}

function bit(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.setStatus(Status.Zero, (cpu.ac & cpu.load(param)) == 0)
  cpu.setStatus(Status.Overflow, <bool>((cpu.load(param) >> 6) & 1))
  cpu.setStatus(Status.Negative, <bool>(cpu.load(param) >> 7))
}

export default bind
