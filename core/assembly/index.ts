import Fnes from './Fnes'

export function createInstance(): Fnes {
  return new Fnes()
}

export function renderFrame(instance: Fnes): void {
  instance.renderFrame()
}

export function step(instance: Fnes): void {
  instance.cpu.step()
}

export function getState(instance: Fnes): StaticArray<usize> {
  return instance.getState()
}

export function getWramPointer(instance: Fnes): usize {
  return changetype<usize>(instance.cpuBus.wram.buffer) + instance.cpuBus.wram.byteOffset
}

export function getFrameBufferPointer(instance: Fnes): usize {
  return changetype<usize>(instance.ppu.frameBuffer.buffer) + instance.ppu.frameBuffer.byteOffset
}

export function loadRom(instance: Fnes, buffer: ArrayBuffer): void {
  instance.loadRom(buffer)
}

export function setProgramCounter(instance: Fnes, value: u16): void {
  instance.cpu.pc = value
}
