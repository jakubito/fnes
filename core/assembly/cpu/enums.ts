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

export enum ControllerAddress {
  PlayerOne = 0x4016,
  PlayerTwo = 0x4017,
}
