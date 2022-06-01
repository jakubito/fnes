import Fnes from './fnes'

export function createInstance(): Fnes {
  return new Fnes()
}

export function step(instance: Fnes): void {
  instance.cpu.step()
}

export function getCpuState(instance: Fnes): StaticArray<u16> {
  return instance.cpu.getState()
}

export function getWramPointer(instance: Fnes): usize {
  return changetype<usize>(instance.bus.wram.buffer) + instance.bus.wram.byteOffset
}
