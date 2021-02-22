const ws = require('ws');
const EventEmitter = require("events");
const socketcheck = require('./modules/socket');
const {getdata, getquestions} = require('./modules/getdata')
const message = require('./modules/messageHandler')
const answerHandler = require("./modules/answerHandler")
const {goldHandler, goldchance, getPlayers} = require("./modules/goldHandler")
const delay = ms => new Promise(res => setTimeout(res, ms));
class Blooket extends EventEmitter {
  constructor(options) {
    super()
    // Game Options
    this.options = {}
    options = options || {}
    this.options.repeat = options.repeat || true
    // Cafe Mode Only Option
    this.options.cafebonus = options.cafebonus || 50
    // Factory Mode Only Options
    this.options.blooktime = options.blooktime || 1000
    this.options.blookcash = options.blookcash || 100
    // Battle Royale and Classic mode Only Options
    this.options.answertime = options.answertime || 1
    // All Game Modes
    this.questions = null
    this.mode = null
    this.pin = null
    this.socket = null
    this.gameid = null
    this.name = null
    this.animal = null
    this.mode = null
    this.CurrentIndex = 0
    this.TotalIndex = null
    this.correct = null
    this.cash = 0
    this.gamestarted = 0
    // For Gold Game Mode
    this.prizes = null
    this.steal = null
    // For fatory mode only
    this.blooks = 0
    // Battle Royale only
    this.shuffle = null
  }
  async join(pin, name, animal, spam=false) {
    await socketcheck(pin).then((socket) => { this.socket = new ws(socket.url)})
    this.pin = pin
    this.animal = animal
    this.name = name
    console.log("Connected!");
    this.emit("SocketConnect", this.socket);
    await getdata(this).then((data) => {
      this.gameid = data[0]
      this.mode = data[1].toLowerCase()
      console.log(this.mode)
      if (this.mode == 'factory') {
        this.mode = 'fact'
      }
      if (this.mode == 'racing') {
        this.mode = 'race'
      }
    })
    if (this.animal == "random") {
      this.animal = await this.randomblook()
    }
    await this.connect()
    if (spam == true) {
      return null
    }
    this.emit("joined", this)
    await getquestions(this.gameid).then((questions) => {
      this.questions = questions.questions
      this.TotalIndex = questions.questions.length - 1
    })
    if (this.mode == "royale" || this.mode == "classic") {
      this.socket.on('message', (data) => {
        if (data.includes("q-")) {
          this.currentIndex = JSON.parse(data).d.b.d.split("q-")[1].split("-")[0] - 1
          this.shuffle = JSON.parse(data).d.b.d.split("q-")[1].split("-")[1]
          this.startquestion()
        }
      })
    } else {
    this.socket.on('message', (data) => {message(data, this)})
    this.on("GameStart", function() {
        this.gamestarted = 1
        this.CurrentIndex = 0
        this.startquestion()
    })
  }
  }
  randomblook() {
    return new Promise(async(resolve, reject) => {
      var blooklist = []
      var playerlist = await getPlayers(this)
      for (var player in playerlist) {
        blooklist.push(playerlist[player].b)
      }
      console.log(blooklist)
      var blooks = ["Chick","Chicken","Cow","Goat","Horse","Pig","Sheep","Duck","Dog","Cat","Rabbit","Goldfish","Hamster","Turtle","Kitten","Puppy","Bear","Moose","Fox","Raccoon","Squirrel","Owl","Hedgehog","Tiger","Orangutan","Cockatoo","Parrot","Anaconda","Jaguar","Macaw","Toucan","Panther","Capuchin","Snowy_Owl","Polar_Bear","Artic_Fox","Baby_Penguin","Penguin","Arctic_Hare","Seal","Walrus","Witch","Wizard","Elf","Fairy","Slime_Monster","Jester","Dragon","Queen","Unicorn","King","Two_of_Spades","Eat_Me","Drink_Me","Alice","Queen_of_Hearts","Dormouse","White_Rabbit","Cheshire_Cat","Caterpillar","Mad_Hatter","King_of_Hearts","Toast","Cereal","Yogurt","Breakfast_Combo","Orange_Juice","Milk","Waffle","Pancakes","French_Toast","Pizza","Earth","Meteor","Stars","Alien","Planet","UFO","Spaceship","Astronaut","Snow_Globe","Holiday_Gift","Hot_Chocolate","Holiday_Wreath","Gingerbread_Man","Gingerbread_House","Snowman","Santa_Claus","Pumpkin","Swamp_Monster","Frankenstein","Vampire","Zombie","Mummy","Werewolf","Ghost","Red_Astronaut","Blue_Astronaut","Green_Astronaut","Pink_Astronaut","Orange_Astronaut","Yellow_Astronaut","Black_Astronaut","Purple_Astronaut","Brown_Astronaut","Cyan_Astronaut","Lime_Astronaut","Spooky_Pumpkin","Spooky_Mummy","Spooky_Ghost","Frost_Wreath","Tropical_Globe"];
      blooklist.forEach((blook) => {
          delete blooks[blooks.indexOf(blook)]
      });
      var blooks = blooks.filter(function (blook) {
        return blook != null
      });
      return resolve(blooks[Math.floor(Math.random() * blooks.length)])
    })
  }
  connect() {
    return new Promise((resolve,reject) => {
        this.socket.removeAllListeners()
        this.socket.send(`{"t":"d","d":{"r":2,"a":"p","b":{"p":"/${this.pin}/c/${this.name}","d":{"b":"${this.animal}"}}}}`)
        return resolve()
    })
  }

  async startquestion() {
    if (this.mode != "royale" & this.mode != "classic") {
      this.socket.removeAllListeners()
    }
    if (this.CurrentIndex == this.TotalIndex & this.options.repeat == true) {
      this.CurrentIndex = 0
    } else if (this.options.repat == false) {
      exit("OOQ => Out Of Questions");
    }
    await delay(1000);
    this.emit("QuestionStart",this.questions[this.CurrentIndex])
  }

 autocorrect() {
   var q = this.questions[this.CurrentIndex]
   if (this.mode == "royale" || this.mode == "classic") {
     return this.shuffle[q.answers.indexOf(q.correctAnswers[0])]
   } else {
     return q.answers.indexOf(q.correctAnswers[0]) + 1
   }
  }
 async answer(a) {
   console.log("Answering Question: " + this.CurrentIndex)
   if (this.mode == "royale") {
     this.socket.send(`{"t":"d","d":{"r":1,"a":"p","b":{"p":"/${this.pin}/a/${this.name}","d":{"a":${a},"t":${this.options.answertime}}}}}`)
   } else if (this.mode == "classic") {
        this.socket.send(`{"t":"d","d":{"r":1,"a":"p","b":{"p":"/${this.pin}/c/${this.name}","d":{"a":${a},"t":${this.options.answertime}}}}}`)
    }  else {
     await answerHandler(a-1, this).then((correct) => {
       this.correct = correct
       this.CurrentIndex += 1
     })
     if (this.correct == true) {
       this.emit("Correct")
       if (this.mode == "gold") {
         await goldchance().then((prizes) => {
           this.prizes = prizes
           this.emit("GetGold")
         })
       } else if (this.mode == "cafe") {
         this.cash += this.options.cafebonus
         this.socket.send(`{"t":"d","d":{"r":1,"a":"p","b":{"p":"/${this.pin}/c/${this.name}","d":{"b":"${this.animal}","ca":${this.cash}}}}}`)
         game.emit("NextQuestion")
       } else if (this.mode == "fact") {
         this.blooks += 1
         console.log(`You have ${this.blooks} blooks`)
         setInterval(function() {
           game.cash += game.options.blookcash
           game.socket.send(`{"t":"d","d":{"r":1,"a":"p","b":{"p":"/${game.pin}/c/${game.name}","d":{"b":"${game.animal}","ca":${game.cash}}}}}`)
         }, this.options.blooktime);
         this.emit("NextQuestion")
       } else if (this.mode == "race") {
         this.cash += 1 // Cash is the race position in this index.
         this.socket.send(`{"t":"d","d":{"r":1,"a":"p","b":{"p":"/${this.pin}/c/${this.name}","d":{"b":"${this.animal}","pr":${this.cash}}}}}`)
         this.emit("NextQuestion")
       }
     } else {
       this.emit("Incorrect")
     }
   }
 }

 async getgold(p) {
   await goldHandler(p, this).then((e) => {
     if (e[1] == "l") {
      this.socket.send(`{"t":"d","d":{"r":2,"a":"p","b":{"p":"/${this.pin}/c/${this.name}","d":{"b":"${this.animal}","g":${this.cash}}}}}`)
      this.emit("NextQuestion")
    } else if (e[1] == "d") {
      this.cash = e[0]
      this.socket.send(`{"t":"d","d":{"r":1,"a":"p","b":{"p":"/${this.pin}/c/${this.name}","d":{"b":"${this.animal}","g":${this.cash}}}}}`)
      this.emit("NextQuestion")
    }else if (e[1] == "s") {
      this.steal = e
      this.emit("Swap",e[0])
    } else if (e[2] == "t") {
       this.steal = e
       this.emit("Steal",e[0])
     }
   })
 }

 swap(player) {
   var targetanimal = this.steal[0][player].b
   this.socket.on("message", function(data) {
     data = JSON.parse(data)
     if (data.d.b.d.at) {
       console.log("You swapped!")
       game.cash = data.d.b.d.g || 0
       game.emit("NextQuestion")
     }
   })
   this.cash = Math.floor(this.cash)
   this.socket.send(`{"t":"d","d":{"r":1,"a":"p","b":{"p":"/${this.pin}/c/${player}","d":{"at":"${this.name}:${this.animal}:swap","b":"${targetanimal}","g":${this.cash}}}}}`)
 }

 rob(player) {
   var target = this.steal[0][player]
   var percent = this.steal[1]
   if (!target.g) {
     target.g = 0
   }
   var amount = (percent / 100) * target.g
   var remaining = target.g - amount
   this.cash += amount
   this.socket.send(`{"t":"d","d":{"r":1,"a":"p","b":{"p":"/${this.pin}/c/${this.name}","d":{"at":"${player}:${target.b}:${amount}","b":"${this.animal}","g":${remaining}}}}}`)
   this.emit("NextQuestion")
 }
 async BotSpam(pin, name, animal, n) {
   var t = 0
   while (n > t) {
    this.join(pin, name + String(t), animal, true)
    await delay(1500)
    console.log("Joined")
    t += 1
   }
 }
}
module.exports = Blooket;
