import Cpu from './cpu'
import { Address } from './enums'

export type InstructionHandler = (cpu: Cpu, value: u16, mode: Address) => void
