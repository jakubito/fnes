import moduleUrl from '../core/build/core.wasm?url'
import { instantiate } from '../core/build/core'
import Client, { DisplayMode } from './client'
import { CoreModule } from './types'
import './style.css'

const compiledModule = await WebAssembly.compileStreaming(fetch(moduleUrl))
const module = await instantiate(compiledModule, { env: {} })
const client = new Client(module as CoreModule)
const root = document.querySelector<HTMLElement>('#root')!

client.appendCanvasTo(root)

const buttons = document.querySelector<HTMLElement>('#buttons')!

const startButton = document.createElement('button')
startButton.onclick = () => client.start()
startButton.innerHTML = 'Start'
buttons.appendChild(startButton)

const stopButton = document.createElement('button')
stopButton.onclick = () => client.stop()
stopButton.innerHTML = 'Pause'
buttons.appendChild(stopButton)

const toggleModeButton = document.createElement('button')
toggleModeButton.onclick = () => {
  client.displayMode =
    client.displayMode === DisplayMode.Original ? DisplayMode.PixelPerfect : DisplayMode.Original
}
toggleModeButton.innerHTML = 'Toggle display mode'
buttons.appendChild(toggleModeButton)

root.style.display = 'flex'
root.style.justifyContent = 'center'

window.addEventListener('dragover', (event) => {
  event.preventDefault()
})

window.addEventListener('drop', async (event) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (!file) return
  const fileBuffer = await file.arrayBuffer()
  client.loadFile(fileBuffer)
  client.start()
})
