import { useAtomValue } from 'jotai'
import { screenElementAtom } from '../state'
import { Title } from './Title'
import { Controls } from './Controls'
import { Settings } from './Settings'
import { Mappings } from './Mappings'
import { Screen } from './Screen'
import { Button } from './Button'

export function App() {
  const screenElement = useAtomValue(screenElementAtom)

  return (
    <div className="flex flex-row min-h-screen">
      <div className="w-96 shrink-0 p-6">
        <div className="flex flex-col gap-3">
          <Title />
          <Controls />
          <hr className="border-neutral-300 my-1" />
          <Settings />
          <hr className="border-neutral-300 my-1" />
          <Mappings />
        </div>
      </div>
      <div className="flex flex-col items-center gap-5 p-6">
        <Screen />
        <Button onClick={() => screenElement?.requestFullscreen({ navigationUI: 'hide' })}>
          ⛶ Go full screen
        </Button>
      </div>
    </div>
  )
}
