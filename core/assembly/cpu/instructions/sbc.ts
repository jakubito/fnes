import Cpu from '../cpu'
import { Address } from '../enums'
import { adc } from './adc'

function bind(cpu: Cpu): void {
  cpu.bind(0xe9, sbc, Address.Immediate, 2)
  cpu.bind(0xeb, sbc, Address.Immediate, 2)
  cpu.bind(0xe5, sbc, Address.Zeropage, 3)
  cpu.bind(0xf5, sbc, Address.ZeropageX, 4)
  cpu.bind(0xed, sbc, Address.Absolute, 4)
  cpu.bind(0xfd, sbc, Address.AbsoluteX, 4, true)
  cpu.bind(0xf9, sbc, Address.AbsoluteY, 4, true)
  cpu.bind(0xe1, sbc, Address.IndirectX, 6)
  cpu.bind(0xf1, sbc, Address.IndirectY, 5, true)
}

export function sbc(cpu: Cpu, param: u16, mode: Address): void {
  const value = mode == Address.Immediate ? <u8>param : cpu.load(param)
  adc(cpu, ~value, Address.Immediate)
}

export default bind
