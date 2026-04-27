import Fnes from './Fnes'

export function createInstance(): Fnes {
  return new Fnes()
}

export function getFrameBufferPtr(instance: Fnes): usize {
  return changetype<usize>(instance.ppu.frameBuffer.buffer) + instance.ppu.frameBuffer.byteOffset
}

export function getAudioBufferPtr(instance: Fnes): StaticArray<usize> {
  return [
    changetype<usize>(instance.apu.resampler.output.meta.buffer) +
      instance.apu.resampler.output.meta.byteOffset,
    changetype<usize>(instance.apu.resampler.output.buffer.buffer) +
      instance.apu.resampler.output.buffer.byteOffset,
  ]
}

export function getPlayerOnePtr(instance: Fnes): usize {
  return (
    changetype<usize>(instance.inputs.playerOne.buttons.buffer) +
    instance.inputs.playerOne.buttons.byteOffset
  )
}

export function getPlayerTwoPtr(instance: Fnes): usize {
  return (
    changetype<usize>(instance.inputs.playerTwo.buttons.buffer) +
    instance.inputs.playerTwo.buttons.byteOffset
  )
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
