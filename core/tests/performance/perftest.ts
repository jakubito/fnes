import { dirname, join } from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { performance } from 'perf_hooks'
import { instantiate } from '../../build/core.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const moduleBuffer = readFileSync(join(__dirname, '../../build/core.wasm'))
const romBuffer = readFileSync(join(__dirname, 'nestress.nes'))
const compiledModule = await WebAssembly.compile(moduleBuffer)
const module = await instantiate(compiledModule, { env: {} })
const instance = module.createInstance()

module.loadFile(instance, romBuffer)

const start = performance.now()
const frames = 1000

for (let i = 0; i < frames; i++) {
  module.renderFrame(instance)
}

const end = performance.now()
const duration = end - start
const fps = (frames / (duration / 1000)).toFixed(3)

console.log(`Rendered ${frames} frames in ${duration.toFixed(3)} ms (${fps} fps)`)
