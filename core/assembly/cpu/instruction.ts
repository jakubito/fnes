import Cpu from './cpu'
import { Address } from './enums'
import { InstructionHandler } from './types'

class Instruction {
  cpu: Cpu
  handler: InstructionHandler
  mode: Address

  constructor(cpu: Cpu, handler: InstructionHandler, mode: Address) {
    this.cpu = cpu
    this.handler = handler
    this.mode = mode
  }

  execute(): void {
    this.handler(this.cpu, this.getValue(), this.mode)
  }

  getValue(): u16 {
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
      case Address.AbsoluteX:
        return this.cpu.readWord() + this.cpu.x
      case Address.AbsoluteY:
        return this.cpu.readWord() + this.cpu.y
      case Address.Indirect:
        return this.cpu.loadWord(this.cpu.readWord())
      case Address.IndirectX:
        return this.cpu.loadWord(this.cpu.readByte() + this.cpu.x)
      case Address.IndirectY:
        return this.cpu.loadWord(this.cpu.readByte()) + this.cpu.y
      default:
        return 0
    }
  }
}

export default Instruction
