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
