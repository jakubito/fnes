import { useState } from 'preact/hooks'
import { useResetAtom } from 'jotai/utils'
import { Button as InputButton } from '../input'
import { buttonMapAtom } from '../state'
import { Button } from './Button'
import { Mapping } from './Mapping'

export function Mappings() {
  const [expanded, setExpanded] = useState(false)
  const reset = useResetAtom(buttonMapAtom)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-5 mb-1">
        <div className="text-lg font-medium">Button mappings</div>
        <div className="flex gap-2">
          <Button onClick={() => setExpanded(!expanded)}>{expanded ? 'Collapse' : 'Expand'}</Button>
          <Button onClick={() => reset()}>↺</Button>
        </div>
      </div>
      <div className="flex flex-col gap-1" style={{ display: expanded ? undefined : 'none' }}>
        <Mapping button={InputButton.Right} />
        <Mapping button={InputButton.Left} />
        <Mapping button={InputButton.Down} />
        <Mapping button={InputButton.Up} />
        <Mapping button={InputButton.Start} />
        <Mapping button={InputButton.Select} />
        <Mapping button={InputButton.B} />
        <Mapping button={InputButton.A} />
      </div>
    </div>
  )
}
