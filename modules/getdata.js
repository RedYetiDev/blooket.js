const got = require('got')
async function getdata(self) {
  return new Promise((resolve,reject) => {
  self.socket.on('open', function() {
    self.socket.send(`{"t":"d","d":{"r":2,"a":"q","b":{"p":"/${self.pin}","h":""}}}`)
  })
  self.socket.on('message', function(data) {
    data = JSON.parse(data)
    try {
      if (data.d.b.p == self.pin) {
        this.removeAllListeners()
        return resolve([data.d.b.d.set,data.d.b.d.s.t])
      }
    } catch (e) {console.log(e)}
  });
  })
}
function getquestions(id) {
  return new Promise(async(resolve, reject) => {
    res = await got(`https://api.blooket.com/api/games?gameId=${id}`)
    questiondata = JSON.parse(res.body)
    return resolve(questiondata)
  });
}
module.exports = {getdata, getquestions}
