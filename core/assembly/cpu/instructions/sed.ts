import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xf8, sed, Mode.Implied, 2)
}

function sed(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.setStatus(Status.Decimal, true)
}

export default bind
