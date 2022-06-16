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
