import { Title } from './Title'
import { Controls } from './Controls'
import { Settings } from './Settings'
import { Mappings } from './Mappings'
import { Screen } from './Screen'

export function App() {
  return (
    <div className="flex flex-row min-h-screen">
      <div className="w-96 shrink-0 p-6">
        <div className="flex flex-col gap-3">
          <Title />
          <Controls />
          <hr className="my-1" />
          <Settings />
          <hr className="my-1" />
          <Mappings />
        </div>
      </div>
      <div className="p-8 shrink-0 grow">
        <Screen />
      </div>
    </div>
  )
}
