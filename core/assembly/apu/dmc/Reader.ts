import { Bus as CpuBus } from '../../cpu'
import { Irq } from '../../cpu/enums'
import { Interrupts } from '../../main'

class Reader {
  cpuBus: CpuBus | null = null
  irqEnabled: bool = false
  irqTriggered: bool = false
  loop: bool = false

  addressParam: u16 = 0
  address: u16 = 0
  lengthParam: u16 = 0
  length: u16 = 0

  buffer: u8 = 0
  bufferEmpty: bool = true

  constructor(private interrupts: Interrupts) {}

  reset(): void {
    this.irqEnabled = false
    this.irqTriggered = false
    this.loop = false
    this.addressParam = 0
    this.address = 0
    this.lengthParam = 0
    this.length = 0
    this.buffer = 0
    this.bufferEmpty = true
  }

  init(bus: CpuBus): void {
    this.cpuBus = bus
  }

  restart(): void {
    if (this.length == 0) {
      this.loadAddress()
      this.loadBuffer()
    }
  }

  stop(): void {
    this.length = 0
  }

  setIrqEnable(value: bool): void {
    this.irqEnabled = value
    if (!this.irqEnabled) this.clearIrq()
  }

  clearIrq(): void {
    this.irqTriggered = false
    this.interrupts.clearIrq(Irq.Dmc)
  }

  @inline
  setLoop(value: bool): void {
    this.loop = value
  }

  @inline
  setAddress(value: u8): void {
    this.addressParam = 0xc000 + value * 64
  }

  @inline
  setLength(value: u8): void {
    this.lengthParam = value * 16 + 1
  }

  @inline
  loadAddress(): void {
    this.address = this.addressParam
    this.length = this.lengthParam
  }

  loadBuffer(): void {
    if (!this.bufferEmpty || this.length == 0) return

    this.buffer = this.cpuBus!.load(this.address)
    this.bufferEmpty = false
    this.length--
    this.cpuBus!.cpu!.cycles += 4

    if (this.address < 0xffff) {
      this.address++
    } else {
      this.address = 0x8000
    }

    if (this.length == 0) {
      if (this.loop) {
        this.loadAddress()
      } else if (this.irqEnabled) {
        this.irqTriggered = true
        this.interrupts.triggerIrq(Irq.Dmc)
      }
    }
  }

  takeBuffer(): u8 {
    const value: u8 = this.buffer
    this.bufferEmpty = true
    this.loadBuffer()
    return value
  }
}

export default Reader
