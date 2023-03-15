import Cpu from '../Cpu'
import { Mode, Status } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0xc6, dec, Mode.Zeropage, 5)
  cpu.bind(0xd6, dec, Mode.ZeropageX, 6)
  cpu.bind(0xce, dec, Mode.Absolute, 6)
  cpu.bind(0xde, dec, Mode.AbsoluteX, 7)
}

export function dec(cpu: Cpu, param: u16, mode: Mode): void {
  const value = cpu.load(param) - 1
  cpu.store(param, value)
  cpu.sr.set(Status.Zero, value == 0)
  cpu.sr.set(Status.Negative, value >> 7)
}

export default bind
