class BitRegister {
  constructor(public value: u8 = 0) {}

  get(bit: u8): bool {
    return <bool>((this.value >> bit) & 1)
  }

  set<T>(bit: u8, value: T): void {
    if (value) this.value |= 1 << bit
    else this.value &= ~(1 << bit)
  }
}

export default BitRegister
