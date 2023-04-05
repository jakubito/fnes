import type { JSXInternal } from 'preact/src/jsx'
import { cx } from '../helpers'

interface Props {
  primary?: boolean
  secondary?: boolean
}

export function Button(props: Props & JSXInternal.HTMLAttributes<HTMLButtonElement>) {
  const { primary, secondary, className, ...buttonProps } = props
  return (
    <button
      type="button"
      className={cx(
        'rounded px-2 py-px active:pt-[2px] active:pb-0 disabled:!py-px',
        !primary && !secondary && 'bg-zinc-200 text-black active:bg-zinc-300',
        primary && 'bg-zinc-900 text-neutral-100 active:bg-zinc-800 disabled:bg-zinc-500',
        secondary &&
          'bg-white border border-b-2 border-gray-400active:bg-gray-50 hover:border-gray-500 active:border-b active:pb-px',
        className
      )}
      {...buttonProps}
    />
  )
}
