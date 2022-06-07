import Cpu from './cpu'
import { Address } from './enums'
import { InstructionHandler } from './types'

class Instruction {
  constructor(
    public cpu: Cpu,
    public handler: InstructionHandler,
    public mode: Address,
    public cycles: u8,
    public pageCheck: bool
  ) {}

  execute(): void {
    this.handler(this.cpu, this.getParam(), this.mode)
    this.cpu.cycles += this.cycles
  }

  getParam(): u16 {
    switch (this.mode) {
      case Address.Immediate:
      case Address.Relative:
      case Address.Zeropage:
        return this.cpu.readByte()
      case Address.ZeropageX:
        return this.cpu.readByte() + this.cpu.x
      case Address.ZeropageY:
        return this.cpu.readByte() + this.cpu.y
      case Address.Absolute:
        return this.cpu.readWord()
      case Address.AbsoluteX: {
        const word = this.cpu.readWord()
        const param = word + this.cpu.x
        if (this.pageCheck && word >> 8 != param >> 8) this.cpu.cycles += 1
        return param
      }
      case Address.AbsoluteY: {
        const word = this.cpu.readWord()
        const param = word + this.cpu.y
        if (this.pageCheck && word >> 8 != param >> 8) this.cpu.cycles += 1
        return param
      }
      case Address.Indirect:
        return this.cpu.loadWord(this.cpu.readWord())
      case Address.IndirectX:
        return this.cpu.loadWord(this.cpu.readByte() + this.cpu.x)
      case Address.IndirectY: {
        const word = this.cpu.loadWord(this.cpu.readByte())
        const param = word + this.cpu.y
        if (this.pageCheck && word >> 8 != param >> 8) this.cpu.cycles += 1
        return param
      }
      default:
        return 0
    }
  }
}

export default Instruction
