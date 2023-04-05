import { useEffect, useRef, useState } from 'preact/hooks'
import { useSetAtom } from 'jotai'
import { screenElementAtom, useClient } from '../state'
import { cx } from '../helpers'

export function Screen() {
  const { client } = useClient()
  const container = useRef<HTMLDivElement>(null)
  const setScreenElement = useSetAtom(screenElementAtom)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(document.fullscreenElement === container.current)
    setScreenElement(container.current!)
    client.appendCanvasTo(container.current!)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  return (
    <div
      ref={container}
      class={cx(
        'bg-black w-fit h-fit rounded overflow-hidden',
        fullscreen && 'flex items-center justify-center'
      )}
    />
  )
}
