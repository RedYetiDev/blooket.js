function goldHandler(p, self) {
   return new Promise(async(resolve,reject) => {
     var prize = self.prizes[p - 1]
     if (parseInt(prize) || prize == 0) {
       self.cash += prize
       return resolve([self.cash,"d"])
     } else if (prize == "t10") {
       await getPlayers(self).then((players) => {
         console.log(players)
         return resolve([players,10,"t"])
       })
     } else if (prize == "t25") {
       await getPlayers(self).then((players) => {
         console.log(players)
         return resolve([players,25,"t"])
       })
     } else if (prize == "l25") {
       var cash = (25 / 100) * self.cash
       return resolve([cash, "l"])
     } else if (prize == "l50") {
       var cash = (50 / 100) * self.cash
       return resolve([cash, "l"])
     } else if (prize == "swap") {
       await getPlayers(self).then((players) => {
         console.log(players)
         return resolve([players,"s"])
       })
     } else if (prize == "double") {
       self.cash *= 3
       self.socket.send(`{"t":"d","d":{"r":2,"a":"p","b":{"p":"/${self.pin}/c/${self.name}","d":{"b":"${self.animal}","g":${self.cash}}}}}`)
       return resolve([self.cash,"d"])
     } else if (prize == "triple") {
       self.cash *= 3
       self.socket.send(`{"t":"d","d":{"r":2,"a":"p","b":{"p":"/${self.pin}/c/${self.name}","d":{"b":"${self.animal}","g":${self.cash}}}}}`)
       return resolve([self.cash,"d"])
     }
 })
 }
function getPlayers(self) {
  return new Promise((resolve, reject) => {
  self.socket.on("message", function(data) {
    console.log("Received")
    data = JSON.parse(data)
    console.log(data)
    try {
      if (data.d.b.p == `${self.pin}/c`) {
        this.removeAllListeners()
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
module.exports = goldHandler
