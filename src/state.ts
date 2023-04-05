import { atom, createStore, useAtomValue } from 'jotai'
import { Client, DisplayMode, Status } from './client'
import * as storage from './storage'

export const store = createStore()

const clientAtom = atom<Client | null>(null)
const clientStatusAtom = atom<Status | null>(null)
export const screenElementAtom = atom<HTMLDivElement | null>(null)

export const screenScaleAtom = persistedAtom('screenScale', 2)
export const speedAtom = persistedAtom('speed', 1)
export const displayModeAtom = persistedAtom('displayMode', DisplayMode.Original)
export const imageSmoothingAtom = persistedAtom('imageSmoothing', true)

function persistedAtom<T>(key: string, value: T) {
  const newAtom = atom(value)
  const persistedValue = storage.get<T>(key)
  if (persistedValue !== null) store.set(newAtom, persistedValue)
  store.sub(newAtom, () => storage.set(key, store.get(newAtom)))
  return newAtom
}

export function useClient() {
  const client = useAtomValue(clientAtom)
  const status = useAtomValue(clientStatusAtom)
  if (client === null || status === null) throw new Error('Client not initialized')
  return { client, status }
}

export function setClient(client: Client) {
  store.set(clientAtom, client)
  store.set(clientStatusAtom, client.status)

  client.onStatusChange = (status) => store.set(clientStatusAtom, status)
  client.speed = store.get(speedAtom)
  client.screenScale = store.get(screenScaleAtom)
  client.displayMode = store.get(displayModeAtom)
  client.imageSmoothing = store.get(imageSmoothingAtom)

  store.sub(speedAtom, () => (client.speed = store.get(speedAtom)))
  store.sub(screenScaleAtom, () => (client.screenScale = store.get(screenScaleAtom)))
  store.sub(displayModeAtom, () => (client.displayMode = store.get(displayModeAtom)))
  store.sub(imageSmoothingAtom, () => (client.imageSmoothing = store.get(imageSmoothingAtom)))
}
