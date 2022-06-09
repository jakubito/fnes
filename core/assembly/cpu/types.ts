import Cpu from './Cpu'
import { Mode } from './enums'

export type InstructionHandler = (cpu: Cpu, param: u16, mode: Mode) => void
