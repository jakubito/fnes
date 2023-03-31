import { __AdaptedExports } from '../core/build/core'

export type CoreModule = typeof __AdaptedExports & { __collect: () => void }
export type CoreInstance = ReturnType<typeof __AdaptedExports.createInstance>
