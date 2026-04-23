import { dirname, join } from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { equal } from 'assert/strict'
import { instantiate } from '../../build/core.js'

class NestestError extends Error {
  logLine: number

  constructor(message: string, logLine: number) {
    super(message)
    this.logLine = logLine
  }
}

type State = [
  pc: number,
  sp: number,
  sr: number,
  ac: number,
  x: number,
  y: number,
  cycles: number,
  ppuLine: number,
  ppuDot: number,
]

const __dirname = dirname(fileURLToPath(import.meta.url))
const moduleBuffer = readFileSync(join(__dirname, '../../build/core.wasm'))
const romBuffer = readFileSync(join(__dirname, 'nestest.nes'))
const log = readFileSync(join(__dirname, 'nestest.log'), 'utf-8').split(/\r?\n/)

const compiledModule = await WebAssembly.compile(moduleBuffer)
const module = await instantiate(compiledModule, { env: {} })
const instance = module.createInstance()

module.loadFile(instance, romBuffer.buffer)
module.setProgramCounter(instance, 0xc000)

for (let i = 0; i < log.length - 1; i += 1) {
  const state = formatState(module.getState(instance) as State)
  const logState = formatLine(log[i])
  try {
    equal(state, logState)
    module.step(instance)
  } catch (error) {
    if (error instanceof Error) {
      throw new NestestError(error.message, i + 1)
    }
    throw error
  }
}

console.info('nestest passed')

function hex(value: number, pad = 2) {
  return value.toString(16).padStart(pad, '0').toUpperCase()
}

function formatState(state: State) {
  const [pc, sp, sr, ac, x, y, cycles, ppuLine, ppuDot] = state
  return [
    hex(pc, 4),
    `A:${hex(ac)}`,
    `X:${hex(x)}`,
    `Y:${hex(y)}`,
    `P:${hex(sr)}`,
    `SP:${hex(sp)}`,
    `PPU:${ppuLine.toString().padStart(3)},${ppuDot.toString().padStart(3)}`,
    `CYC:${cycles}`,
  ].join(' ')
}

function formatLine(line: string) {
  return `${line.substring(0, 4)} ${line.substring(48)}`
}
