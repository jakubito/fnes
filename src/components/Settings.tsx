import { useAtom, useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import {
  displayModeAtom,
  imageSmoothingAtom,
  screenElementAtom,
  screenScaleAtom,
  speedAtom,
} from '../state'
import { DisplayMode } from '../client'
import { clamp } from '../helpers'
import { Button } from './Button'

export function Settings() {
  const [speed, setSpeed] = useAtom(speedAtom)
  const [screenScale, setScreenScale] = useAtom(screenScaleAtom)
  const [displayMode, setDisplayMode] = useAtom(displayModeAtom)
  const [imageSmoothing, setImageSmoothing] = useAtom(imageSmoothingAtom)
  const screenElement = useAtomValue(screenElementAtom)
  const resetSpeed = useResetAtom(speedAtom)
  const resetScreenScale = useResetAtom(screenScaleAtom)
  const resetDisplayMode = useResetAtom(displayModeAtom)
  const resetImageSmoothing = useResetAtom(imageSmoothingAtom)

  const setClampedSpeed = (value: number) => setSpeed(clamp(value, 0.25, 8))
  const setClampedScreenScale = (value: number) => setScreenScale(clamp(value, 1, 10))

  const reset = () => {
    resetSpeed()
    resetScreenScale()
    resetDisplayMode()
    resetImageSmoothing()
  }

  return (
    <>
      <div className="flex items-center gap-5 mb-1">
        <div className="text-lg font-medium">Emulation settings</div>
        <Button onClick={reset}>↺</Button>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-28">Speed</div>
        <Button onClick={() => setClampedSpeed(speed - 0.25)}>-</Button>
        <span className="w-12 text-center">{speed * 100}%</span>
        <Button onClick={() => setClampedSpeed(speed + 0.25)}>+</Button>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-28">Screen scale</div>
        <Button onClick={() => setClampedScreenScale(screenScale - 1)}>-</Button>
        <span className="w-3 text-center">{screenScale}</span>
        <Button onClick={() => setClampedScreenScale(screenScale + 1)}>+</Button>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-28">Aspect ratio</div>
        <div className="flex items-center">
          <input
            type="radio"
            id="displayMode1"
            name="displayMode"
            checked={displayMode === DisplayMode.Original}
            onClick={() => setDisplayMode(DisplayMode.Original)}
          />
          <label htmlFor="displayMode1" className="pl-2">
            Original
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="displayMode0"
            name="displayMode"
            checked={displayMode === DisplayMode.PixelPerfect}
            onClick={() => setDisplayMode(DisplayMode.PixelPerfect)}
          />
          <label htmlFor="displayMode0" className="pl-2">
            Pixel perfect
          </label>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="imageSmoothing"
          className="peer"
          checked={imageSmoothing}
          disabled={displayMode === DisplayMode.PixelPerfect}
          onChange={(event) => setImageSmoothing(event.currentTarget.checked)}
        />
        <label htmlFor="imageSmoothing" className="peer-disabled:text-neutral-500 pl-2">
          Enable image smoothing
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={() => screenElement?.requestFullscreen({ navigationUI: 'hide' })}>
          Go full screen
        </Button>
      </div>
    </>
  )
}
