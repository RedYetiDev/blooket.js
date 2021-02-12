async function getdata(self) {
  return new Promise((resolve,reject) => {
  self.socket.on('open', function() {
    self.socket.send(`{"t":"d","d":{"r":2,"a":"q","b":{"p":"/${self.pin}","h":""}}}`)
  })
  self.socket.on('message', function(data) {
    data = JSON.parse(data)
    console.log(data)
    try {
      if (data.d.b.p == self.pin) {
        return resolve([data.d.b.d.set,data.d.b.d.s.t])
      }
    } catch (e) {console.log(e)}
  });
  })
}
module.exports = getdata