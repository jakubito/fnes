export enum PpuMask {
  y = 0b111_00_00000_00000,
  NN = 0b11_00000_00000,
  N = 0b10_00000_00000,
  n = 0b1_00000_00000,
  Y = 0b11111_00000,
  X = 0b11111,
}

export enum Control {
  Nametable0,
  Nametable1,
  VramIncrement,
  SpritePattern,
  BackgroundPattern,
  SpriteSize,
  PpuMode,
  GenerateNmi,
}

export enum Mask {
  Grayscale,
  ShowLeftBackground,
  ShowLeftSprites,
  ShowBackground,
  ShowSprites,
  EmphasizeRed,
  EmphasizeGreen,
  EmphasizeBlue,
}

export enum Status {
  SpriteOverflow = 5,
  SpriteZeroHit = 6,
  VerticalBlank = 7,
}

export enum Mirroring {
  Horizontal,
  Vertical,
  FourScreen,
}
