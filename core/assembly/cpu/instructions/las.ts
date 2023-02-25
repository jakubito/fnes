import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xbb, las, Mode.AbsoluteY, 4, true)
}

function las(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.ac = cpu.x = cpu.sp = cpu.load(param) & cpu.sp
  cpu.sr.set(Status.Zero, cpu.ac == 0)
  cpu.sr.set(Status.Negative, cpu.ac >> 7)
}

export default bind
