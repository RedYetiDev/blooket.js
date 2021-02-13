const ws = require('ws');
const EventEmitter = require("events");
const socketcheck = require('./modules/socket');
const getdata = require('./modules/getdata')
const message = require('./modules/messageHandler')
const getquestions = require('./modules/questions')
const answerHandler = require("./modules/answerHandler")
const goldchance = require("./modules/goldchance")
const goldHandler = require("./modules/goldHandler")
const delay = ms => new Promise(res => setTimeout(res, ms));
class Blooket extends EventEmitter {
    /**
   * @constructor - The contructor to the Blooket.JS class
   * @param {object} options - The Blooket.JS options. Currently, you can use "repeat, true/false, default true". Must be a JSON object.
   */
  constructor(options) {
    super()
    // Game Options
    this.options = {}
    options = options || {}
    this.options.repeat = options.repeat || true
    // All Game Modes
    this.questions = null
    this.mode = null
    this.pin = null
    this.socket = null
    this.gameid = null
    this.name = null
    this.animal = null
    this.mode = null
    this.currency = null
    this.CurrentIndex = 0
    this.TotalIndex = null
    this.correct = null
    this.cash = 0
    this.gamestarted = 0
    // For Gold Game Mode
    this.prizes = null
    this.steal = null
    // Options configure
  }
  /**
  * @param {number} pin - The game pin
  * @param {string} name - The client's name
  * @param {string} animal - The client's animal picture
  */
  async join(pin, name, animal) {
    await socketcheck(pin).then((socket) => { this.socket = new ws(socket.url)})
    this.pin = pin
    this.animal = animal
    this.name = name
    console.log("Connected!");
    this.emit("SocketConnect", this.socket);
    await getdata(this).then((data) => {
      this.gameid = data[0]
      this.mode = data[1].toLowerCase()
      if (this.mode == 'gold') {
        this.currency = 'g'
      } else if (this.mode == 'cafe' || this.mode == 'factory') {
        this.currency = 'ca'
      }
    })
    await this.connect()
    this.emit("joined", this)
    await getquestions(this.gameid).then((questions) => {
      this.questions = questions.questions
      this.TotalIndex = questions.questions.length - 1
    })
    this.socket.on('message', (data) => {message(data, this)})
    this.on("GameStart", function() {
        this.gamestarted = 1
        this.CurrentIndex = 0
        this.startquestion()
    })
  }
  /**
  * Sends the player information to the websocket
  */
  connect() {
    return new Promise((resolve,reject) => {
        this.socket.removeAllListeners()
        this.socket.send(`{"t":"d","d":{"r":2,"a":"p","b":{"p":"/${this.pin}/c/${this.name}","d":{"b":"${this.animal}"}}}}`)
        return resolve()
    })
  }
  /**
  * Starts the question, changes the question index for the next question
  */
  async startquestion() {
    this.socket.removeAllListeners()
    if (this.CurrentIndex == this.TotalIndex & this.options.repeat == true) {
      this.CurrentIndex = 0
    } else if (this.options.repat == false) {
      exit("OOQ => Out Of Questions");
    }
    await delay(1000);
    this.emit("QuestionStart",this.questions[this.CurrentIndex])
  }
  /**
  * @param {number}
  */
 async answer(a) {
   console.log("Answering Question: " + this.CurrentIndex)
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
     }
   }
 }
 /**
 * @param {number} - The prize to open
 */
 async getgold(p) {
   await goldHandler(p, this).then((e) => {
     console.log(e)
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
       console.log(this.steal[0])
       this.emit("Steal",e[0])
     }
   })
 }
 /**
 * @param {string} - The player to swap from
 */
 swap(player) {
   var targetanimal = this.steal[0][player].b
   this.socket.on("message", function(data) {
     console.log(this)
     data = JSON.parse(data)
     console.log(data.d)
     if (data.d.b.d.at) {
       console.log("You swapped!")
       console.log(data.d.b.d.g)
       game.cash = data.d.b.d.g || 0
       game.emit("NextQuestion")
     }
   })
   this.cash = Math.floor(this.cash)
   this.socket.send(`{"t":"d","d":{"r":1,"a":"p","b":{"p":"/${this.pin}/c/${player}","d":{"at":"${this.name}:${this.animal}:swap","b":"${targetanimal}","g":${this.cash}}}}}`)
 }
 /**
 * @param {string} - The player to steal from
 */
 rob(player) {
   var target = this.steal[0][player]
   var percent = this.steal[1]
   console.log(target)
   if (!target.g) {
     target.g = 0
   }
   var amount = (percent / 100) * target.g
   var remaining = target.g - amount
   console.log(amount)
   this.cash += amount
   this.socket.send(`{"t":"d","d":{"r":1,"a":"p","b":{"p":"/${this.pin}/c/${this.name}","d":{"at":"${player}:${target.b}:${amount}","b":"${this.animal}","g":${remaining}}}}}`)
   this.emit("NextQuestion")
 }
}
module.exports = Blooket;
