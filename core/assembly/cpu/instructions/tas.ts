import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x9b, tas, Mode.AbsoluteY, 5)
}

function tas(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.sp = cpu.ac & cpu.x
  cpu.store(param, cpu.sp & (<u8>(param >> 8) + 1))
}

export default bind
