import Cpu from '../Cpu'
import { Mode } from '../enums'
import { adc } from './adc'

function bind(cpu: Cpu): void {
  cpu.bind(0xe9, sbc, Mode.Immediate, 2)
  cpu.bind(0xeb, sbc, Mode.Immediate, 2)
  cpu.bind(0xe5, sbc, Mode.Zeropage, 3)
  cpu.bind(0xf5, sbc, Mode.ZeropageX, 4)
  cpu.bind(0xed, sbc, Mode.Absolute, 4)
  cpu.bind(0xfd, sbc, Mode.AbsoluteX, 4, true)
  cpu.bind(0xf9, sbc, Mode.AbsoluteY, 4, true)
  cpu.bind(0xe1, sbc, Mode.IndirectX, 6)
  cpu.bind(0xf1, sbc, Mode.IndirectY, 5, true)
}

export function sbc(cpu: Cpu, param: u16, mode: Mode): void {
  const value = mode == Mode.Immediate ? <u8>param : cpu.load(param)
  adc(cpu, ~value, Mode.Immediate)
}

export default bind
