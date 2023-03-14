import { dirname, join } from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { equal } from 'assert'
import { instantiate } from '../../build/core.js'

type StateTuple = [
  pc: number,
  sp: number,
  sr: number,
  ac: number,
  x: number,
  y: number,
  cycles: number,
  ppuLine: number,
  ppuDot: number,
  ppuV: number,
  ppuT: number,
  ppuX: number,
  ppuW: number
]

type State = {
  pc: number
  sp: number
  sr: number
  ac: number
  x: number
  y: number
  cycles: number
  ppuLine: number
  ppuDot: number
  ppuV: number
  ppuT: number
  ppuX: number
  ppuW: number
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const moduleBuffer = readFileSync(join(__dirname, '../../build/core.wasm'))
const compiledModule = await WebAssembly.compile(moduleBuffer)
const module = await instantiate(compiledModule, { env: {} })
const instance = module.createInstance()

function state() {
  const state = <StateTuple>module.getState(instance)
  const [pc, sp, sr, ac, x, y, cycles, ppuLine, ppuDot, ppuV, ppuT, ppuX, ppuW] = state
  return { pc, sp, sr, ac, x, y, cycles, ppuLine, ppuDot, ppuV, ppuT, ppuX, ppuW } as State
}

function runTimes(n: number, fn: () => void) {
  for (let i = 0; i < n; i++) fn()
}

equal(state().ppuT, 0)
module.ppuSetControl(instance, 0b11)
equal(state().ppuT, 0b11_00000_00000)
module.ppuSetControl(instance, 0b01)
equal(state().ppuT, 0b01_00000_00000)
module.ppuSetControl(instance, 0b10)
equal(state().ppuT, 0b10_00000_00000)
module.ppuSetControl(instance, 0)
equal(state().ppuT, 0)
equal(state().ppuV, 0)
equal(state().ppuW, 0)
module.ppuReadStatus(instance)
equal(state().ppuW, 0)
module.ppuSetScroll(instance, 0b01111_101)
equal(state().ppuT, 0b1111)
equal(state().ppuX, 0b101)
equal(state().ppuW, 1)
module.ppuSetScroll(instance, 0b01011110)
equal(state().ppuT, 0b110_00_01011_01111)
equal(state().ppuX, 0b101)
equal(state().ppuW, 0)
module.ppuSetAddress(instance, 0b00111101)
equal(state().ppuT, 0b011_11_01011_01111)
equal(state().ppuV, 0)
equal(state().ppuX, 0b101)
equal(state().ppuW, 1)
module.ppuSetAddress(instance, 0b11110000)
equal(state().ppuV, 0b011_11_01111_10000)
equal(state().ppuT, 0b011_11_01111_10000)
equal(state().ppuX, 0b101)
equal(state().ppuW, 0)
module.ppuSetScroll(instance, 0)
equal(state().ppuW, 1)
module.ppuReadStatus(instance)
equal(state().ppuW, 0)
module.ppuSetAddress(instance, 0)
module.ppuSetAddress(instance, 0)
equal(state().ppuT, 0)
equal(state().ppuV, 0)
equal(state().ppuX, 0)
equal(state().ppuW, 0)
module.ppuIncrementCoarseX(instance)
equal(state().ppuV, 1)
module.ppuIncrementCoarseX(instance)
module.ppuIncrementCoarseX(instance)
module.ppuIncrementCoarseX(instance)
equal(state().ppuV, 4)
module.ppuSetAddress(instance, 0)
module.ppuSetAddress(instance, 0b11111)
equal(state().ppuV, 0b11111)
module.ppuIncrementCoarseX(instance)
equal(state().ppuV, 0b1_00000_00000)
runTimes(31, () => module.ppuIncrementCoarseX(instance))
equal(state().ppuV, 0b1_00000_11111)
module.ppuIncrementCoarseX(instance)
equal(state().ppuV, 0)
module.ppuIncrementFineY(instance)
equal(state().ppuV, 0b1_00_00000_00000)
runTimes(6, () => module.ppuIncrementFineY(instance))
equal(state().ppuV, 0b111_00_00000_00000)
module.ppuIncrementFineY(instance)
equal(state().ppuV, 0b000_00_00001_00000)
runTimes(7, () => module.ppuIncrementFineY(instance))
equal(state().ppuV, 0b111_00_00001_00000)
runTimes(28 * 8, () => module.ppuIncrementFineY(instance))
equal(state().ppuV, 0b111_00_11101_00000)
module.ppuIncrementFineY(instance)
equal(state().ppuV, 0b000_10_00000_00000)
module.ppuIncrementFineY(instance)
equal(state().ppuV, 0b001_10_00000_00000)
runTimes(6, () => module.ppuIncrementFineY(instance))
equal(state().ppuV, 0b111_10_00000_00000)
module.ppuIncrementFineY(instance)
equal(state().ppuV, 0b000_10_00001_00000)
runTimes(7, () => module.ppuIncrementFineY(instance))
equal(state().ppuV, 0b111_10_00001_00000)
runTimes(28 * 8, () => module.ppuIncrementFineY(instance))
equal(state().ppuV, 0b111_10_11101_00000)
module.ppuIncrementFineY(instance)
equal(state().ppuV, 0)
module.ppuSetAddress(instance, 0)
module.ppuSetAddress(instance, 0)
equal(state().ppuT, 0)
equal(state().ppuV, 0)
module.ppuSetAddress(instance, 0b00000011)
module.ppuSetAddress(instance, 0b11000000)
equal(state().ppuV, 0b000_00_11110_00000)
runTimes(7, () => module.ppuIncrementFineY(instance))
equal(state().ppuV, 0b111_00_11110_00000)
module.ppuIncrementFineY(instance)
equal(state().ppuV, 0b000_00_11111_00000)
runTimes(7, () => module.ppuIncrementFineY(instance))
equal(state().ppuV, 0b111_00_11111_00000)
module.ppuIncrementFineY(instance)
equal(state().ppuV, 0)

console.info('pputest passed')
