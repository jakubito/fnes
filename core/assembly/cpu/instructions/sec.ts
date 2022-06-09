import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x38, sec, Mode.Implied, 2)
}

function sec(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.setStatus(Status.Carry, true)
}

export default bind
