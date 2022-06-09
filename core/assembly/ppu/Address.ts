class Address {
  value: u16
  ptr: bool

  update(byte: u8): void {
    this.value &= (<u16>0xff) << (<u8>this.ptr * 8)
    this.value |= (<u16>byte) << ((1 - <u8>this.ptr) * 8)
    this.value &= 0x3fff
    this.ptr = !this.ptr
  }

  increment(value: u8): void {
    this.value += value
    this.value &= 0x3fff
  }
}

export default Address
