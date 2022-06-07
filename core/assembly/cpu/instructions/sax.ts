import Cpu from '../cpu'
import { Address } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x87, sax, Address.Zeropage, 3)
  cpu.bind(0x97, sax, Address.ZeropageY, 4)
  cpu.bind(0x8f, sax, Address.Absolute, 4)
  cpu.bind(0x83, sax, Address.IndirectX, 6)
}

function sax(cpu: Cpu, param: u16, mode: Address): void {
  cpu.store(param, cpu.ac & cpu.x)
}

export default bind
