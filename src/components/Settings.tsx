import { useAtom, useAtomValue } from 'jotai'
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

  const setClampedSpeed = (value: number) => setSpeed(clamp(value, 0.25, 8))
  const setClampedScreenScale = (value: number) => setScreenScale(clamp(value, 1, 10))

  return (
    <>
      <div className="text-lg font-medium">Settings</div>
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
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="displayMode1"
            name="displayMode"
            defaultChecked={displayMode === DisplayMode.Original}
            onChange={() => setDisplayMode(DisplayMode.Original)}
          />
          <label htmlFor="displayMode1">Original</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="displayMode0"
            name="displayMode"
            defaultChecked={displayMode === DisplayMode.PixelPerfect}
            onChange={() => setDisplayMode(DisplayMode.PixelPerfect)}
          />
          <label htmlFor="displayMode0">Pixel perfect</label>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="imageSmoothing"
          defaultChecked={imageSmoothing}
          onChange={(event) => setImageSmoothing(event.currentTarget.checked)}
        />
        <label htmlFor="imageSmoothing">Enable image smoothing</label>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={() => screenElement?.requestFullscreen({ navigationUI: 'hide' })}>
          Go full screen
        </Button>
      </div>
    </>
  )
}
