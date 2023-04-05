import type { JSXInternal } from 'preact/src/jsx'
import { useClient } from '../state'
import { Status } from '../client'
import { Button } from './Button'

const statusLabel: Readonly<Record<Status, string>> = {
  [Status.Ready]: 'Ready',
  [Status.Running]: 'Running',
  [Status.Stopped]: 'Stopped',
}

export function Controls() {
  const { client, status } = useClient()

  const onFileInput = async (event: JSXInternal.TargetedEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (!file) return
    client.loadFile(await file.arrayBuffer())
    client.start()
  }

  return (
    <>
      <input
        type="file"
        className="cursor-pointer text-black file:rounded-[4px] file:bg-zinc-200 file:px-2 file:py-px file:mr-2 file:border-0 file:cursor-pointer"
        accept=".nes,.zip"
        onInput={onFileInput}
      />
      <div className="flex items-center gap-3">
        <Button primary onClick={() => client.start()} disabled={status === Status.Running}>
          Start
        </Button>
        <Button primary onClick={() => client.stop()} disabled={status === Status.Stopped}>
          Stop
        </Button>
        <Button primary onClick={() => client.reset()}>
          Reset
        </Button>
        <div>
          Status: <span className="font-semibold">{statusLabel[status]}</span>
        </div>
      </div>
    </>
  )
}