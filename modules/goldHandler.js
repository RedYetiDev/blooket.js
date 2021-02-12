 goldHandler(self, prize) {
   return new Promise(async(resolve,reject) => {
   var prize = self.prizes[prize - 1]
   console.log(self.prizes)
   console.log(prize)
   var prize = "t10"
   if (parseInt(prize)) {
     self.cash += self.prize
     self.socket.send(`{"t":"d","d":{"r":2,"a":"p","b":{"p":"/${self.pin}/c/${self.name}","d":{"b":"${self.animal}","g":${self.cash}}}}}`)
   } else if (prize == "t10") {
     await take(10, self).then((num) => {return resolve(num)})
   }
 })
 }
getPlayers(self) {
  return new Promise((resolve, reject) => {
  self.socket.on("message", function(data) {
    console.log("Received")
    data = JSON.parse(data)
    console.log(data)
    try {
      if (data.d.b.p == `${self.pin}/c`) {
        var players = data.d.b.d
        delete players[self.name]
        console.log(players)
        return resolve(players)
    }} catch(e) {console.log(e)}
  })
  console.log("Sending...")
  self.socket.send(`{"t":"d","d":{"r":1,"a":"q","b":{"p":"/${self.pin}/c","h":""}}}`)
})
}

take(percent, self) {
  return new Promis(async(resolve,reject) => {
   await getplayers(self).then((players) => {
     console.log(players)
   })
  })
}
module.exports = goldHander