import { render } from 'preact'
import { Provider } from 'jotai'
import { Toaster, toast } from 'react-hot-toast'
import moduleUrl from '../core/build/core.wasm?url'
import { instantiate } from '../core/build/core'
import type { CoreModule } from './types'
import { setClient, store } from './state'
import { Client } from './client'
import { loadFile } from './helpers'
import { App } from './components/App'
import './style.css'

const compiledModule = await WebAssembly.compileStreaming(fetch(moduleUrl))
const module = await instantiate(compiledModule, { env: {} })
const client = new Client(module as CoreModule)

const introUrl = 'https://raw.githubusercontent.com/jakubito/fnes-intro/master/build/intro.nes'
const introResponse = await fetch(introUrl)
client.loadFile(await introResponse.arrayBuffer())

setClient(client)

window.addEventListener('dragover', (event) => {
  event.preventDefault()
})

window.addEventListener('drop', async (event) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (file) loadFile(client, file)
})

window.addEventListener('blur', () => {
  client.stop()
})

window.addEventListener('click', (event) => {
  if (event.target instanceof HTMLElement) event.target.blur()
})

window.addEventListener('gamepadconnected', () => {
  toast('Gamepad connected')
})

window.addEventListener('gamepaddisconnected', () => {
  toast('Gamepad disconnected')
})

render(
  <Provider store={store}>
    <Toaster />
    <App />
  </Provider>,
  document.querySelector('#root')!
)
