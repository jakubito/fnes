import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xb8, clv, Mode.Implied, 2)
}

function clv(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.setStatus(Status.Overflow, false)
}

export default bind
