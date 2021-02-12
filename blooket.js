const ws = require('ws');
const EventEmitter = require("events");
const socketcheck = require('./modules/socket');
const getdata = require('./modules/getdata')
const message = require('./modules/messageHandler')
const getquestions = require('./modules/questions')
const answerHandler = require("./modules/answerHandler")
const goldchance = require("./modules/goldchance")
const goldHandler = require("./modules/goldHandler")
class Blooket extends EventEmitter {
  constructor(options={}) {
    super()
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
  }
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
    console.log(`Connected as ${this.name} with the animal ${this.animal}. The game mode is ${this.mode}, that means that the currency is ${this.currency}`)
    this.emit("joined", this)
    await getquestions(this.gameid).then((questions) => {
      this.questions = questions.questions
      this.TotalIndex = questions.questions.length - 1
    })
    this.socket.on('message', (data) => {message(data, this)})
    this.on("GameStart", function() {
        this.gamestarted = 1
        this.startquestion()
    })
  }
  connect() {
    return new Promise((resolve,reject) => {
        this.socket.on('message', function(data) {console.log(data)})
        this.socket.send(`{"t":"d","d":{"r":2,"a":"p","b":{"p":"/${this.pin}/c/${this.name}","d":{"b":"${this.animal}"}}}}`)
        return resolve()
    })
  }
  async startquestion() {
    console.log(this.CurrentIndex)
    console.log(this.questions[0])
    console.log(`Question: ${this.questions[this.CurrentIndex]}`)
    this.emit("QuestionStart",this.questions[this.CurrentIndex])
  }
 async answer(a) {
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
 async getgold(prize) {
   await goldHander(prize, this).then((e) => {console.log(e)})
 }
}
module.exports = Blooket;