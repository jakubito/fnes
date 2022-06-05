import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x87, sax, Address.Zeropage)
  cpu.bind(0x97, sax, Address.ZeropageY)
  cpu.bind(0x8f, sax, Address.Absolute)
  cpu.bind(0x83, sax, Address.IndirectX)
}

function sax(cpu: Cpu, value: u16, mode: Address): void {
  cpu.store(value, cpu.ac & cpu.x)
}

export default bind
