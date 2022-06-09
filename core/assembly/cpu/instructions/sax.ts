import Cpu from '../Cpu'
import { Mode } from '../enums'

function bind(cpu: Cpu): void {
  cpu.bind(0x87, sax, Mode.Zeropage, 3)
  cpu.bind(0x97, sax, Mode.ZeropageY, 4)
  cpu.bind(0x8f, sax, Mode.Absolute, 4)
  cpu.bind(0x83, sax, Mode.IndirectX, 6)
}

function sax(cpu: Cpu, param: u16, mode: Mode): void {
  cpu.store(param, cpu.ac & cpu.x)
}

export default bind
