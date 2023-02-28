class Register<T extends u8> {
  constructor(public value: u8 = 0) {}

  get(bit: T): bool {
    return <bool>((this.value >> (<u8>bit)) & 1)
  }

  set<V extends bool>(bit: T, bitValue: V): void {
    if (bitValue) this.value |= 1 << (<u8>bit)
    else this.value &= ~(1 << (<u8>bit))
  }

  setValue(value: u8): void {
    this.value = value
  }

  reset(): void {
    this.value = 0
  }
}

export default Register
