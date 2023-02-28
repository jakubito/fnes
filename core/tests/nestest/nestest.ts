import { dirname, join } from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { equal } from 'assert'
import { instantiate } from '../../build/core.js'

type State = [
  pc: number,
  sp: number,
  sr: number,
  ac: number,
  x: number,
  y: number,
  cycles: number,
  ppuScanline: number,
  ppuPosition: number
]

const __dirname = dirname(fileURLToPath(import.meta.url))
const moduleBuffer = readFileSync(join(__dirname, '../../build/core.wasm'))
const romBuffer = readFileSync(join(__dirname, 'nestest.nes'))
const log = readFileSync(join(__dirname, 'nestest.log'), 'utf-8').split(/\r?\n/)

const compiledModule = await WebAssembly.compile(moduleBuffer)
const module = await instantiate(compiledModule, { env: {} })
const fnes = module.createInstance()

module.loadRom(fnes, romBuffer)
module.setProgramCounter(fnes, 0xc000)

for (let i = 0; i < log.length - 1; i += 1) {
  const state = formatState(<State>module.getState(fnes))
  const logState = formatLine(log[i])
  try {
    equal(state, logState)
    module.step(fnes)
  } catch (error) {
    error.logLine = i + 1
    throw error
  }
}

console.info('nestest passed')

function hex(value: number, pad = 2) {
  return value.toString(16).padStart(pad, '0').toUpperCase()
}

function formatState(state: State) {
  const [pc, sp, sr, ac, x, y, cycles, ppuScanline, ppuPosition] = state
  return [
    hex(pc, 4),
    `A:${hex(ac)}`,
    `X:${hex(x)}`,
    `Y:${hex(y)}`,
    `P:${hex(sr)}`,
    `SP:${hex(sp)}`,
    `PPU:${ppuScanline.toString().padStart(3)},${ppuPosition.toString().padStart(3)}`,
    `CYC:${cycles}`,
  ].join(' ')
}

function formatLine(line: string) {
  return `${line.substring(0, 4)} ${line.substring(48)}`
}
