import Bus from '../bus'
import { word } from '../helpers'
import { Address, Status } from './enums'
import Instruction from './instruction'
import bindings from './instructions'
import { InstructionHandler } from './types'

class Cpu {
  instructions: StaticArray<Instruction | null> = new StaticArray(0x100)
  totalCycles: usize
  cycles: u8

  pc: u16
  sp: u8
  sr: u8
  ac: u8
  x: u8
  y: u8

  constructor(public bus: Bus) {
    for (let i = 0; i < bindings.length; i += 1) bindings.at(i)(this)
    this.reset()
  }

  bind(
    opcode: u8,
    handler: InstructionHandler,
    mode: Address,
    cycles: u8,
    pageCheck: bool = false
  ): void {
    this.instructions[opcode] = new Instruction(this, handler, mode, cycles, pageCheck)
  }

  reset(): void {
    this.totalCycles = 0
    this.cycles = 0
    this.pc = this.loadWord(0xfffc)
    this.sp = 0xfd
    this.sr = 0b0010_0100
    this.ac = 0
    this.x = 0
    this.y = 0
  }

  step(): void {
    const opcode = this.readByte()
    const instruction = this.instructions[opcode]
    if (!instruction) throw new Error(`Unknown opcode 0x${opcode.toString(16)}`)
    this.cycles = 0
    instruction.execute()
    this.totalCycles += this.cycles
  }

  readByte(): u8 {
    const byte = this.load(this.pc)
    this.pc += 1
    return byte
  }

  readWord(): u16 {
    return word(this.readByte(), this.readByte())
  }

  load(address: u16): u8 {
    return this.bus.load(address)
  }

  store(address: u16, value: u8): void {
    this.bus.store(address, value)
  }

  loadWord(address: u16): u16 {
    return this.bus.loadWord(address)
  }

  storeWord(address: u16, value: u16): void {
    this.bus.storeWord(address, value)
  }

  getStatus(flag: Status): bool {
    return <bool>((this.sr >> (<u8>flag)) & 1)
  }

  setStatus(flag: Status, value: bool): void {
    if (value) {
      this.sr |= 1 << (<u8>flag)
    } else {
      this.sr &= ~(1 << (<u8>flag))
    }
  }

  pullFromStack(): u8 {
    this.sp += 1
    return this.load(0x100 + this.sp)
  }

  pushToStack(value: u8): void {
    this.store(0x100 + this.sp, value)
    this.sp -= 1
  }

  getState(): StaticArray<usize> {
    return [this.pc, this.sp, this.sr, this.ac, this.x, this.y, this.totalCycles]
  }
}

export default Cpu
