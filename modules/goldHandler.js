/**
* @returns {array} - Returns an array containing 3 random prizes.
*/
function goldchance() {
  return new Promise((resolve,reject) => {
    const probability = [ // Help form https://stackoverflow.com/questions/66141403/javascript-chance-with-decimals/66141958 on probability
      { "gold": "l50"    , "chance":  1   }, //  1.0 * 2 =  2 | [   0,   1 ]
      { "gold": "swap"   , "chance":  2   }, //  2.0 * 2 =  4 | [   2,   5 ]
      { "gold": 0        , "chance":  2   }, //  2.0 * 2 =  4 | [   6,   9 ]
      { "gold": "l25"    , "chance":  3   }, //  3.0 * 2 =  6 | [  10,  15 ]
      { "gold": "t10"    , "chance":  4   }, //  4.0 * 2 =  8 | [  16,  23 ]
      { "gold": "t25"    , "chance":  4   }, //  4.0 * 2 =  8 | [  24,  31 ]
      { "gold": "triple" , "chance":  4   }, //  4.0 * 2 =  8 | [  32,  39 ]
      { "gold": 10       , "chance":  5   }, //  5.0 * 2 = 10 | [  40,  49 ]
      { "gold": 100      , "chance":  7.5 }, //  7.5 * 2 = 15 | [  50,  64 ]
      { "gold": "double" , "chance":  9   }, //  9.0 * 2 = 18 | [  65,  82 ]
      { "gold": 20       , "chance": 12.5 }, // 12.5 * 2 = 25 | [  83, 107 ]
      { "gold": 50       , "chance": 13.5 }, // 13.5 * 2 = 27 | [ 108, 134 ]
      { "gold": 40       , "chance": 15   }, // 15.0 * 2 = 30 | [ 135, 164 ]
      { "gold": 30       , "chance": 17.5 }  // 17.5 * 2 = 35 | [ 165, 199 ]
    ];

    const lookupIndex = (n) => {
      if (n >=   0 && n <   2) return 0;
      if (n >=   2 && n <   6) return 1;
      if (n >=   6 && n <  10) return 2;
      if (n >=  10 && n <  16) return 3;
      if (n >=  16 && n <  24) return 4;
      if (n >=  24 && n <  32) return 5;
      if (n >=  32 && n <  40) return 6;
      if (n >=  40 && n <  50) return 7;
      if (n >=  50 && n <  65) return 8;
      if (n >=  65 && n <  83) return 9;
      if (n >=  83 && n < 108) return 10;
      if (n >= 108 && n < 135) return 11;
      if (n >= 135 && n < 165) return 12;
      if (n >= 165 && n < 200) return 13;
    };

    const roll = () => lookupIndex(Math.floor(Math.random() * 200));
    result = []
    for (let i = 0; i < 3; i++) {
      const rollIndex = roll();
      result.push(probability[rollIndex].gold)
    }
    return resolve(result)
  })
}

/**
* @param {number} p - The prize number
* @param {object} self - the client
* @returns {array} - Returns an array containing the players (optional), the cash or percent of cash for an action, and the action to perform
*/
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
 /**
 * @param {object} self - the client
 * @returns {promise} - Returns a promise with a list of players with there animal and score.
 */
function getPlayers(self) {
  return new Promise((resolve, reject) => {
  self.socket.on("message", function(data) {
    console.log("Received")
    console.log(data)
    if (data == '{"t":"d","d":{"r":1,"b":{"s":"ok","d":{}}}}') {
      console.log("No Players in game.")
      return resolve([])
    }
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
module.exports = {goldHandler, goldchance, getPlayers}
