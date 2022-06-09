import { pageCrossed } from '../helpers'
import Cpu from './Cpu'
import { Mode } from './enums'
import { InstructionHandler } from './types'

class Instruction {
  constructor(
    public cpu: Cpu,
    public handler: InstructionHandler,
    public mode: Mode,
    public cycles: u8,
    public pageCheck: bool
  ) {}

  execute(): void {
    this.handler(this.cpu, this.getParam(), this.mode)
    this.cpu.cycles += this.cycles
  }

  @inline
  getParam(): u16 {
    switch (this.mode) {
      case Mode.Immediate:
      case Mode.Relative:
      case Mode.Zeropage:
        return this.cpu.readByte()
      case Mode.ZeropageX:
        return this.cpu.readByte() + this.cpu.x
      case Mode.ZeropageY:
        return this.cpu.readByte() + this.cpu.y
      case Mode.Absolute:
        return this.cpu.readWord()
      case Mode.AbsoluteX: {
        const word = this.cpu.readWord()
        const param = word + this.cpu.x
        if (this.pageCheck && pageCrossed(word, param)) this.cpu.cycles++
        return param
      }
      case Mode.AbsoluteY: {
        const word = this.cpu.readWord()
        const param = word + this.cpu.y
        if (this.pageCheck && pageCrossed(word, param)) this.cpu.cycles++
        return param
      }
      case Mode.Indirect:
        return this.cpu.loadWord(this.cpu.readWord())
      case Mode.IndirectX:
        return this.cpu.loadWord(this.cpu.readByte() + this.cpu.x)
      case Mode.IndirectY: {
        const word = this.cpu.loadWord(this.cpu.readByte())
        const param = word + this.cpu.y
        if (this.pageCheck && pageCrossed(word, param)) this.cpu.cycles++
        return param
      }
      default:
        return 0
    }
  }
}

export default Instruction
