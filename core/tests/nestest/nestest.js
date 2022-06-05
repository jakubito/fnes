import { dirname, join } from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { equal } from 'assert'
import { instantiate } from '../../build/core.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const moduleBuffer = readFileSync(join(__dirname, '../../build/core.wasm'))
const romBuffer = readFileSync(join(__dirname, 'nestest.nes'))
const log = readFileSync(join(__dirname, 'nestest.log'), 'utf-8').split(/\r?\n/)

const compiledModule = await WebAssembly.compile(moduleBuffer)
const module = await instantiate(compiledModule, { env: {} })
const fnes = module.createInstance()

module.loadRom(fnes, romBuffer)
module.setPc(fnes, 0xc000)

for (let i = 0; i < log.length; i += 1) {
  const cpuState = formatCpuState(module.getCpuState(fnes))
  const logState = formatLine(log[i])
  try {
    equal(cpuState, logState)
    module.step(fnes)
  } catch (error) {
    error.logLine = i + 1
    throw error
  }
}

function hex(value, pad = 2) {
  return value.toString(16).padStart(pad, '0').toUpperCase()
}

function formatCpuState([pc, sp, sr, ac, x, y]) {
  return [
    hex(pc, 4),
    `A:${hex(ac)}`,
    `X:${hex(x)}`,
    `Y:${hex(y)}`,
    `P:${hex(sr)}`,
    `SP:${hex(sp)}`,
  ].join(' ')
}

function formatLine(line) {
  return `${line.substring(0, 4)} ${line.substring(48, 73)}`
}
