import moduleUrl from '../core/build/core.wasm?url'
import { instantiate } from '../core/build/core'
import './style.css'
import Client from './client'

const compiledModule = await WebAssembly.compileStreaming(fetch(moduleUrl))
const module = await instantiate(compiledModule, { env: {} })
const client = new Client(module)
const root = document.querySelector<HTMLElement>('#root')!

client.appendCanvasTo(root)
