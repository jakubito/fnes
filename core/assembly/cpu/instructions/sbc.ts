import Cpu from '../cpu'
import { Address } from '../enums'
import { adc } from './adc'

function bind(cpu: Cpu): void {
  cpu.bind(0xe9, sbc, Address.Immediate)
  cpu.bind(0xe5, sbc, Address.Zeropage)
  cpu.bind(0xf5, sbc, Address.ZeropageX)
  cpu.bind(0xed, sbc, Address.Absolute)
  cpu.bind(0xfd, sbc, Address.AbsoluteX)
  cpu.bind(0xf9, sbc, Address.AbsoluteY)
  cpu.bind(0xe1, sbc, Address.IndirectX)
  cpu.bind(0xf1, sbc, Address.IndirectY)
}

function sbc(cpu: Cpu, value: u16, mode: Address): void {
  const val = mode == Address.Immediate ? <u8>value : cpu.load(value)
  adc(cpu, ~val, Address.Immediate)
}

export default bind
