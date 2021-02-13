/**
* @params {object} data - The websocket data received
* @params {object} self - The client
*/
function message(data, self) {
  if (data == `{"t":"d","d":{"b":{"p":"${self.pin}/c/${self.name}","d":null},"a":"d"}}`) {
    console.log("Uh Oh! You were disconnected!")
    exit("Disconnected from Blooket")
  } else if (data == `{"t":"d","d":{"b":{"p":"${self.pin}/stg","d":"${self.mode}"},"a":"d"}}` & self.gamestarted == 0) {
    self.socket.removeAllListeners()
    self.emit("GameStart")
    this.CurrentIndex = 0
  }
}
module.exports = message
