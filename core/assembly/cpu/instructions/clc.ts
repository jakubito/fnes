import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x18, clc, Mode.Implied, 2)
}

function clc(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.setStatus(Status.Carry, false)
}

export default bind
