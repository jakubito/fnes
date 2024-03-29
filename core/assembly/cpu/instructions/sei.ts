import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x78, sei, Mode.Implied, 2)
}

function sei(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.sr.set(Status.IrqDisable, true)
}

export default bind
