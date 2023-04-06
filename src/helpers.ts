import { unzipSync } from 'fflate'
import { toast } from 'react-hot-toast'
import { Client } from './client'

export function cx(...entries: unknown[]) {
  return entries
    .flat()
    .filter((entry) => typeof entry === 'string')
    .join(' ')
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export async function loadFile(client: Client, file: File) {
  try {
    client.loadFile(await getRom(file))
    client.start()
  } catch (error) {
    if (error instanceof Error) toast.error(error.message)
  }
}

async function getRom(file: File) {
  const fileBuffer = await file.arrayBuffer()
  const filename = file.name.toLowerCase()
  if (filename.endsWith('.nes')) return fileBuffer
  if (filename.endsWith('.zip')) return unzipRom(fileBuffer)
  throw new Error('Unsupported file format')
}

function unzipRom(fileBuffer: ArrayBuffer) {
  const files = unzipSync(new Uint8Array(fileBuffer), {
    filter: (entry) => entry.name.toLowerCase().endsWith('.nes'),
  })
  const rom = Object.values(files)[0]
  if (!rom) throw new Error('No .nes file found in the archive')
  return rom.buffer
}
