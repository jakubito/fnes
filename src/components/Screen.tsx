import { useEffect, useRef, useState } from 'preact/hooks'
import { useAtom } from 'jotai'
import { screenElementAtom, useClient } from '../state'
import { cx } from '../helpers'

export function Screen() {
  const { client } = useClient()
  const container = useRef<HTMLDivElement>(null)
  const [screenElement, setScreenElement] = useAtom(screenElementAtom)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!container.current) return

    setScreenElement(container.current)
    client.appendCanvasTo(container.current)

    const onFullscreenChange = () => {
      setFullscreen(document.fullscreenElement === container.current)
    }
    window.addEventListener('fullscreenchange', onFullscreenChange)

    return () => {
      window.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  }, [])

  return (
    <div
      ref={container}
      class={cx(
        'bg-black w-fit h-fit rounded overflow-hidden',
        fullscreen && 'flex items-center justify-center'
      )}
      onClick={() => client.start()}
      onDblClick={() => screenElement?.requestFullscreen({ navigationUI: 'hide' })}
    />
  )
}
