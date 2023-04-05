import { Button } from '../input'
import { Mapping } from './Mapping'

export function Mappings() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-5 mb-1">
        <div className="text-lg font-medium">Button mappings</div>
      </div>
      <Mapping button={Button.Right} />
      <Mapping button={Button.Left} />
      <Mapping button={Button.Down} />
      <Mapping button={Button.Up} />
      <Mapping button={Button.Start} />
      <Mapping button={Button.Select} />
      <Mapping button={Button.B} />
      <Mapping button={Button.A} />
    </div>
  )
}
