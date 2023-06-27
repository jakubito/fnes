import Controller from './Controller'

class Inputs {
  playerOne: Controller = new Controller()
  playerTwo: Controller = new Controller()

  setStrobe(value: u8): void {
    const strobe = <bool>(value & 1)
    this.playerOne.setStrobe(strobe)
    this.playerTwo.setStrobe(strobe)
  }
}

export default Inputs
