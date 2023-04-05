import { useEffect, useState } from 'preact/hooks'
import { useAtom } from 'jotai'
import { buttonMapAtom } from '../state'
import { cx } from '../helpers'
import { Button as InputButton } from '../input'
import { Button } from './Button'

interface Props {
  button: InputButton
}

const { A, B, Select, Start, Up, Down, Left, Right } = InputButton
const buttonLabel: Readonly<Record<InputButton, string>> = {
  [A]: 'A',
  [B]: 'B',
  [Select]: 'Select',
  [Start]: 'Start',
  [Up]: '↑',
  [Down]: '↓',
  [Left]: '←',
  [Right]: '→',
}

export function Mapping(props: Props) {
  const { button } = props
  const [buttonMap, setButtonMap] = useAtom(buttonMapAtom)
  const [editing, setEditing] = useState(false)
  const buttonKey = buttonMap[button]
  const hasConflict = Object.values(buttonMap).filter((key) => key === buttonKey).length > 1

  const keyLabel = () => {
    if (editing) return 'Press a key'
    if (buttonKey === ' ') return 'Space'
    return buttonKey
  }

  useEffect(() => {
    if (!editing) return

    const onClick = () => setEditing(false)
    const onKeyDown = (event: KeyboardEvent) => {
      event.preventDefault()
      event.stopPropagation()
      if (event.code !== 'Escape') setButtonMap({ ...buttonMap, [button]: event.key })
      setEditing(false)
    }

    window.addEventListener('click', onClick)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [editing])

  return (
    <div className="flex items-center gap-2">
      <div className="w-20">
        <div
          className={cx(
            'flex items-center justify-center font-medium text-white w-6 h-6 rounded-full text-sm select-none',
            [A, B].includes(button) && 'bg-rose-800',
            [Select, Start].includes(button) && 'bg-zinc-700 w-fit px-2',
            [Up, Down, Left, Right].includes(button) && 'bg-zinc-900'
          )}
        >
          {buttonLabel[button]}
        </div>
      </div>
      <Button
        secondary
        className={cx(
          'px-2 rounded-md border border-b-2 border-gray-400 hover:border-gray-500',
          editing ? '!bg-emerald-50 font-medium' : 'capitalize bg-white hover:bg-gray-100',
          !editing && hasConflict && '!bg-red-50 border-red-500'
        )}
        title="Click to change"
        onClick={() => setEditing(!editing)}
      >
        {keyLabel()}
      </Button>
    </div>
  )
}
