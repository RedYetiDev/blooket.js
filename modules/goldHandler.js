function goldHandler(p, self) {
   return new Promise(async(resolve,reject) => {
     prize = self.prizes[p - 1]
     console.log(self.prizes)
     console.log(prize)
     prize = "t10"
     if (parseInt(prize)) {
       self.cash += self.prize
       self.socket.send(`{"t":"d","d":{"r":2,"a":"p","b":{"p":"/${self.pin}/c/${self.name}","d":{"b":"${self.animal}","g":${self.cash}}}}}`)
     } else if (prize == "t10") {
       await take(self).then((data) => {return resolve([data, 10, "t"])})
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

function take(self) {
  return new Promise(async(resolve,reject) => {
   await getPlayers(self).then((players) => {
     console.log(players)
     return resolve(players)
     // {"t":"d","d":{"r":169,"a":"p","b":{"p":"/106305/c/Jimmy","d":{"at":"Mr Jimmy:Goat:87","b":"Cow","g":259}}}}
   })
  })
}
module.exports = goldHandler
