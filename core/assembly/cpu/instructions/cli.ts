import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x58, cli, Mode.Implied, 2)
}

function cli(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.sr.set(Status.IrqDisable, false)
}

export default bind
