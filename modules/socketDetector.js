const got = require("got")
async function sockets() {
  result = []
  var {body} = await got("https://blooket-2020.firebaseio.com/.lp")
  result.push("wss://" + JSON.parse(body.split('(0,')[1].split(/\n/)[0].split("]);")[0].split("[")[1]).d.d + "/.ws?v=5&ns=blooket-2020")
  var {body} = await got("https://blooket-2021.firebaseio.com/.lp")
  result.push("wss://" + JSON.parse(body.split('(0,')[1].split(/\n/)[0].split("]);")[0].split("[")[1]).d.d + "/.ws?v=5&ns=blooket-2021")
  var {body} = await got("https://blooket-2022.firebaseio.com/.lp")
  result.push("wss://" + JSON.parse(body.split('(0,')[1].split(/\n/)[0].split("]);")[0].split("[")[1]).d.d + "/.ws?v=5&ns=blooket-2022")
  var {body} = await got("https://blooket-2023.firebaseio.com/.lp")
  result.push("wss://" + JSON.parse(body.split('(0,')[1].split(/\n/)[0].split("]);")[0].split("[")[1]).d.d + "/.ws?v=5&ns=blooket-2023")
  var {body} = await got("https://blooket-2024.firebaseio.com/.lp")
  result.push("wss://" + JSON.parse(body.split('(0,')[1].split(/\n/)[0].split("]);")[0].split("[")[1]).d.d + "/.ws?v=5&ns=blooket-2024")
  return result
}
module.exports = sockets
