import Fnes from './Fnes'

export function createInstance(): Fnes {
  return new Fnes()
}

export function getFrameBufferPointer(instance: Fnes): usize {
  return instance.ppu.frameBuffer.dataStart
}

export function getPlayerOneBufferPointer(instance: Fnes): usize {
  return instance.inputs.playerOne.buttons.dataStart
}

export function getPlayerTwoBufferPointer(instance: Fnes): usize {
  return instance.inputs.playerTwo.buttons.dataStart
}

export function loadFile(instance: Fnes, buffer: ArrayBuffer): void {
  instance.loadFile(buffer)
}

export function renderFrame(instance: Fnes): void {
  instance.renderFrame()
}

export function reset(instance: Fnes): void {
  instance.reset()
}

/****** Testing helpers ******/

export function step(instance: Fnes): void {
  instance.cpu.step()
}

export function getState(instance: Fnes): StaticArray<usize> {
  return instance.getState()
}

export function setProgramCounter(instance: Fnes, value: u16): void {
  instance.cpu.pc = value
}

export function ppuIncrementCoarseX(instance: Fnes): void {
  instance.ppu.incrementCoarseX()
}

export function ppuIncrementFineY(instance: Fnes): void {
  instance.ppu.incrementFineY()
}

export function ppuSetControl(instance: Fnes, value: u8): void {
  instance.ppu.setControl(value)
}

export function ppuSetScroll(instance: Fnes, value: u8): void {
  instance.ppu.setScroll(value)
}

export function ppuSetAddress(instance: Fnes, value: u8): void {
  instance.ppu.setAddress(value)
}

export function ppuLoadFromAddress(instance: Fnes): u8 {
  return instance.ppu.loadFromAddress()
}

export function ppuStoreToAddress(instance: Fnes, value: u8): void {
  instance.ppu.storeToAddress(value)
}

export function ppuReadStatus(instance: Fnes): u8 {
  return instance.ppu.readStatus()
}
