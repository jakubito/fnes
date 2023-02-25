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
  SpriteOverflow,
  Sprite0Hit,
  VerticalBlank,
}

export enum Mirroring {
  Vertical,
  Horizontal,
  FourScreen,
}
