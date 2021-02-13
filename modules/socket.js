/**
* @params {number} pin - The game PIN
* @requires ws
* @returns {promise} Returns a promise containing the websocket use for the game.
*/
const WebSocket = require('ws');
function socketcheck(pin) {
  return new Promise((resolve, reject) => {
  var socket = new WebSocket("wss://s-usc1c-nss-250.firebaseio.com/.ws?v=5&ns=blooket-2020")
  socket.on('open', function() {
    socket.send('{"t":"d","d":{"r":2,"a":"q","b":{"p":"/' + pin + '","h":""}}}')
  });

  socket.on("message", function(data) {
    data = JSON.parse(data)
    try {
      if (data.d.b.p == pin) {
        socket.removeAllListeners(); return resolve(socket)
        socket.close()
      }t
    } catch (e) {}
  });
  var first = setTimeout(function() {
    socket = new WebSocket("wss://s-usc1c-nss-242.firebaseio.com/.ws?v=5&ns=blooket-2021")
    socket.on("open", function() {
      socket.send('{"t":"d","d":{"r":2,"a":"q","b":{"p":"/' + pin + '","h":""}}}')
    });
    socket.on("message", function(data) {
      data = JSON.parse(data)
      try {
        if (data.d.b.p == pin) {
          socket.removeAllListeners();
          return resolve(socket)
          socket.close()
        }
      } catch (e) {}
    });
    var seconds = setTimeout(function () {
        var socket = new WebSocket("wss://s-usc1c-nss-201.firebaseio.com/.ws?v=5&ns=blooket-2023")
        socket.on("open", function() {
          socket.send('{"t":"d","d":{"r":2,"a":"q","b":{"p":"/' + pin + '","h":""}}}')
        });
        socket.on("message", function(data) {
          data = JSON.parse(data)
          try {
            if (data.d.b.p == pin) {
              socket.removeAllListeners();
              return resolve(socket)
              socket.close()
            }
          } catch (e) {}
        });
        var third = setTimeout(function () {
          var socket = new WebSocket("wss://s-usc1c-nss-206.firebaseio.com/.ws?v=5&ns=blooket-2022")
          socket.on("open", function() {
            socket.send('{"t":"d","d":{"r":2,"a":"q","b":{"p":"/' + pin + '","h":""}}}')
          });
          socket.on("message", function(data) {
            data = JSON.parse(data)
            try {
              if (data.d.b.p == pin) {
                socket.removeAllListeners();
                return resolve(socket)
                socket.close()
              }
            } catch (e) {}
          });
          var fourth = setTimeout(function () {
            var socket = new WebSocket("wss://s-usc1c-nss-270.firebaseio.com/.ws?v=5&ns=blooket-2024")
            socket.on("open", function() {
              socket.send('{"t":"d","d":{"r":2,"a":"q","b":{"p":"/' + pin + '","h":""}}}')
            });
            socket.on("message", function(data) {
              data = JSON.parse(data)
              try {
                if (data.d.b.p == pin) {
                  socket.removeAllListeners();
                  return resolve(socket)
                  socket.close()
                }
              } catch (e) {}
            });
            setTimeout(function() {
              reject("Invalid PIN")
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
});
}
module.exports = socketcheck;
