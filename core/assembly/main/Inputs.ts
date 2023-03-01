import Controller from './Controller'

class Inputs {
  playerOne: Controller = new Controller()
  playerTwo: Controller = new Controller()
  strobe: bool

  setStrobe(value: u8): void {
    const strobe = <bool>(value & 1)
    if (this.strobe && !strobe) {
      this.playerOne.takeSnapshot()
      this.playerTwo.takeSnapshot()
    }
    this.strobe = strobe
  }
}

export default Inputs
