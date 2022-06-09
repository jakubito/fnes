import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xd8, cld, Mode.Implied, 2)
}

function cld(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.setStatus(Status.Decimal, false)
}

export default bind
