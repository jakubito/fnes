import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x86, stx, Mode.Zeropage, 3)
  cpu.bind(0x96, stx, Mode.ZeropageY, 4)
  cpu.bind(0x8e, stx, Mode.Absolute, 4)
}

function stx(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.store(param, cpu.x)
}

export default bind
