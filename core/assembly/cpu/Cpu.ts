import { Register, Interrupts } from '../main'
import Bus from './Bus'
import Instruction from './Instruction'
import bindings from './instructions'
import { word } from './helpers'
import { Interrupt, InterruptVector, Mode, PpuRegister, Status } from './enums'
import { InstructionHandler } from './types'

class Cpu {
  instructions: StaticArray<Instruction | null> = new StaticArray(0x100)
  pendingInterrupt: Interrupt = Interrupt.Null
  totalCycles: usize = 0
  cycles: usize = 0

  sr: Register<Status> = new Register<Status>()
  pc: u16 = 0
  sp: u8 = 0
  ac: u8 = 0
  x: u8 = 0
  y: u8 = 0

  constructor(private bus: Bus, private interrupts: Interrupts) {
    for (let i = 0; i < bindings.length; i++) bindings.at(i)(this)
    this.reset()
  }

  reset(): void {
    this.pendingInterrupt = Interrupt.Reset
    this.totalCycles = 0
    this.cycles = 0
    this.sr.setValue(0b0010_0000)
    this.pc = 0
    this.sp = 0
    this.ac = 0
    this.x = 0
    this.y = 0
    this.bus.reset()
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

  step(): Interrupt {
    const interrupt = this.pendingInterrupt
    this.pendingInterrupt = this.pollInterrupt()
    if (interrupt != Interrupt.Null) this.handleInterrupt(interrupt)
    else this.runNextInstruction()
    this.bus.tick(this.cycles)
    this.totalCycles += this.cycles
    this.cycles = 0
    return this.pendingInterrupt
  }

  @inline
  pollInterrupt(): Interrupt {
    const interrupt = this.interrupts.poll()
    if (interrupt == Interrupt.Irq && this.sr.get(Status.IrqDisable)) return Interrupt.Null
    return interrupt
  }

  @inline
  handleInterrupt(interrupt: Interrupt): void {
    this.pushWordToStack(this.pc)
    this.pushToStack(this.sr.value | 0b0010_0000)
    this.sr.set(Status.IrqDisable, true)
    this.pc = this.loadWord(unchecked(InterruptVector[interrupt]))
    this.cycles += 7
  }

  @inline
  runNextInstruction(): void {
    const opcode = this.readByte()
    unchecked(this.instructions[opcode])!.run()
  }

  @inline
  readByte(): u8 {
    const byte = this.load(this.pc)
    this.pc++
    return byte
  }

  @inline
  readWord(): u16 {
    return word(this.readByte(), this.readByte())
  }

  @inline
  load(address: u16): u8 {
    return this.bus.load(address)
  }

  @inline
  store(address: u16, value: u8): void {
    this.bus.store(address, value)
    if (address == PpuRegister.OamDma) this.cycles += 513 + (this.totalCycles & 1)
  }

  @inline
  loadWord(address: u16): u16 {
    return this.bus.loadWord(address)
  }

  @inline
  storeWord(address: u16, value: u16): void {
    this.bus.storeWord(address, value)
  }

  @inline
  pullFromStack(): u8 {
    this.sp++
    return this.load(0x100 + this.sp)
  }

  @inline
  pushToStack(value: u8): void {
    this.store(0x100 + this.sp, value)
    this.sp--
  }

  @inline
  pullWordFromStack(): u16 {
    return word(this.pullFromStack(), this.pullFromStack())
  }

  @inline
  pushWordToStack(value: u16): void {
    this.pushToStack(<u8>(value >> 8))
    this.pushToStack(<u8>value)
  }
}

export default Cpu
