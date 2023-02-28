import { Register, Interrupts } from '../main'
import { Interrupt, InterruptVector } from '../main/enums'
import Bus from './Bus'
import Instruction from './Instruction'
import bindings from './instructions'
import { word } from './helpers'
import { Mode, PpuRegister, Status } from './enums'
import { InstructionHandler } from './types'

class Cpu {
  instructions: StaticArray<Instruction | null> = new StaticArray(0x100)
  totalCycles: usize
  cycles: usize

  sr: Register<Status> = new Register<Status>()
  pc: u16
  sp: u8
  ac: u8
  x: u8
  y: u8

  constructor(private bus: Bus, private interrupts: Interrupts) {
    for (let i = 0; i < bindings.length; i += 1) bindings.at(i)(this)
    this.reset()
  }

  reset(): void {
    this.totalCycles = 0
    this.cycles = 0
    this.sr.setValue(0b0010_0000)
    this.pc = 0
    this.sp = 0
    this.ac = 0
    this.x = 0
    this.y = 0
  }

  bind(
    opcode: u8,
    handler: InstructionHandler,
    mode: Mode,
    cycles: u8,
    pageCheck: bool = false
  ): void {
    this.instructions[opcode] = new Instruction(this, handler, mode, cycles, pageCheck)
  }

  step(): void {
    const interrupt = this.pollInterrupt()
    if (<i8>interrupt == -1) this.runNextInstruction()
    else this.handleInterrupt(interrupt)
    this.bus.tick(this.cycles)
    this.totalCycles += this.cycles
    this.cycles = 0
  }

  pollInterrupt(): Interrupt {
    const interrupt = this.interrupts.poll()
    if (interrupt == Interrupt.Irq && this.sr.get(Status.IrqDisable)) return -1
    return interrupt
  }

  handleInterrupt(interrupt: Interrupt): void {
    this.pushWordToStack(this.pc)
    this.pushToStack(this.sr.value | 0b0010_0000)
    this.sr.set(Status.IrqDisable, true)
    this.pc = this.loadWord(InterruptVector[interrupt])
    this.cycles += 7
  }

  runNextInstruction(): void {
    const opcode = this.readByte()
    const instruction = this.instructions[opcode]
    assert(instruction, `Unknown opcode 0x${opcode.toString(16)}`)
    instruction!.run()
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
    if (address == PpuRegister.OamDma) this.cycles += 513 + (this.totalCycles & 1)
  }

  loadWord(address: u16): u16 {
    return this.bus.loadWord(address)
  }

  storeWord(address: u16, value: u16): void {
    this.bus.storeWord(address, value)
  }

  pullFromStack(): u8 {
    this.sp += 1
    return this.load(0x100 + this.sp)
  }

  pushToStack(value: u8): void {
    this.store(0x100 + this.sp, value)
    this.sp -= 1
  }

  pullWordFromStack(): u16 {
    return word(this.pullFromStack(), this.pullFromStack())
  }

  pushWordToStack(value: u16): void {
    this.pushToStack(<u8>(value >> 8))
    this.pushToStack(<u8>value)
  }
}

export default Cpu
