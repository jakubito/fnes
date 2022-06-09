import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x9c, shy, Mode.AbsoluteX, 5)
}

function shy(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.store(param, cpu.y & (<u8>(param >> 8) + 1))
}

export default bind
