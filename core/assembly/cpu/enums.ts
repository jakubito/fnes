export enum Interrupt {
  Null = -1,
  Nmi,
  Reset,
  Irq,
}

export const InterruptVector: StaticArray<u16> = [0xfffa, 0xfffc, 0xfffe]

export enum Mode {
  Implied,
  Immediate,
  Relative,
  Zeropage,
  ZeropageX,
  ZeropageY,
  Absolute,
  AbsoluteX,
  AbsoluteY,
  Indirect,
  IndirectX,
  IndirectY,
  Accumulator,
}

export enum Status {
  Carry = 0,
  Zero = 1,
  IrqDisable = 2,
  Decimal = 3,
  Break = 4,
  Overflow = 6,
  Negative = 7,
}

export enum PpuRegister {
  Control = 0x2000,
  Mask = 0x2001,
  Status = 0x2002,
  OamAddress = 0x2003,
  OamData = 0x2004,
  Scroll = 0x2005,
  Address = 0x2006,
  Data = 0x2007,
  OamDma = 0x4014,
}

export enum ApuRegister {
  Pulse1Duty = 0x4000,
  Pulse1Sweep = 0x4001,
  Pulse1TimerLo = 0x4002,
  Pulse1TimerHi = 0x4003,
  Pulse2Duty = 0x4004,
  Pulse2Sweep = 0x4005,
  Pulse2TimerLo = 0x4006,
  Pulse2TimerHi = 0x4007,
  TriangleLinearCtr = 0x4008,
  TriangleTimerLo = 0x400a,
  TriangleTimerHi = 0x400b,
  NoiseEnvelope = 0x400c,
  NoiseTimer = 0x400e,
  NoiseLength = 0x400f,
  Control = 0x4015,
  FrameCounter = 0x4017,
}

export enum ControllerAddress {
  PlayerOne = 0x4016,
  PlayerTwo = 0x4017,
}
