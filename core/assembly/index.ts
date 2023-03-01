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

export function getFrameBufferPointer(instance: Fnes): usize {
  return changetype<usize>(instance.ppu.frameBuffer.buffer) + instance.ppu.frameBuffer.byteOffset
}

export function getPlayerOneBufferPointer(instance: Fnes): usize {
  const buttons = instance.inputs.playerOne.buttons
  return changetype<usize>(buttons.buffer) + buttons.byteOffset
}

export function getPlayerTwoBufferPointer(instance: Fnes): usize {
  const buttons = instance.inputs.playerTwo.buttons
  return changetype<usize>(buttons.buffer) + buttons.byteOffset
}

export function loadFile(instance: Fnes, buffer: ArrayBuffer): void {
  instance.loadFile(buffer)
}

export function setProgramCounter(instance: Fnes, value: u16): void {
  instance.cpu.pc = value
}
