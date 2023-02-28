class Scroll {
  x: u8
  y: u8
  latch: bool

  update(byte: u8): void {
    if (this.latch) this.y = byte
    else this.x = byte
    this.latch = !this.latch
  }

  resetLatch(): void {
    this.latch = false
  }

  reset(): void {
    this.x = 0
    this.y = 0
    this.latch = false
  }
}

export default Scroll
