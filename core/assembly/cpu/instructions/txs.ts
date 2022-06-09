import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x9a, txs, Mode.Implied, 2)
}

function txs(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.sp = cpu.x
}

export default bind
