export enum Interrupt {
  Nmi,
  Reset,
  Irq,
}

export const InterruptVector: StaticArray<u16> = [0xfffa, 0xfffc, 0xfffe]
