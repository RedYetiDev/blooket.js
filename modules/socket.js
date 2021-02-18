/**
* @params {number} pin - The game PIN
* @requires ws
* @returns {promise} Returns a promise containing the websocket use for the game.
*/
const WebSocket = require('ws');
const Sockets = require("./socketDetector")
function socketcheck(pin) {
  return new Promise(async(resolve, reject) => {
  var sockets = await Sockets().catch((e) => {})
  console.log(sockets)
  var socket = new WebSocket(sockets[0])
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
    socket = new WebSocket(sockets[1])
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
        var socket = new WebSocket(sockets[2])
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
          var socket = new WebSocket(sockets[3])
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
