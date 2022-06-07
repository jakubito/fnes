import Fnes from './fnes'

export function createInstance(): Fnes {
  return new Fnes()
}

export function step(instance: Fnes): void {
  instance.cpu.step()
}

export function getCpuState(instance: Fnes): StaticArray<usize> {
  return instance.cpu.getState()
}

export function getWramPointer(instance: Fnes): usize {
  return changetype<usize>(instance.bus.wram.buffer) + instance.bus.wram.byteOffset
}

export function loadRom(instance: Fnes, buffer: ArrayBuffer): void {
  instance.loadRom(buffer)
}

export function setPc(instance: Fnes, value: u16): void {
  instance.cpu.pc = value
}

export function setTotalCycles(instance: Fnes, value: usize): void {
  instance.cpu.totalCycles = value
}
