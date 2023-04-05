import { render } from 'preact'
import { Provider } from 'jotai'
import moduleUrl from '../core/build/core.wasm?url'
import { instantiate } from '../core/build/core'
import type { CoreModule } from './types'
import { setClient, store } from './state'
import { Client } from './client'
import { App } from './components/App'
import './style.css'

const compiledModule = await WebAssembly.compileStreaming(fetch(moduleUrl))
const module = await instantiate(compiledModule, { env: {} })
const client = new Client(module as CoreModule)

setClient(client)

window.addEventListener('dragover', (event) => {
  event.preventDefault()
})

window.addEventListener('drop', async (event) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (!file) return
  client.loadFile(await file.arrayBuffer())
  client.start()
})

window.addEventListener('blur', () => {
  client.stop()
})

window.addEventListener('click', (event) => {
  if (event.target instanceof HTMLElement) event.target.blur()
})

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')!
)
