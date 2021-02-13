# Blooket.JS

## V 0.1 Beta
In version 0.1, the JS is only for pre release. The only game mode supported is `Gold Quest`, and all of the features do not work fully.

### Features
  - Joining games
  - Playing games
  - Auto answer (can be set to do it correctly)
  - Can use "Prizes", like the normal client

### Semi-Bugs
###### (Bugs that are not bad)
  - Answering takes 1 second exactly
  - When a player tries to steal or swap from the client, the players get the points from the action, but you don't lose any.
### Bugs
  - Client swapping does not work
  - Client can't join mid-game

### Documentation
Better documentation coming soon to [blooket.js.org](https://blooket.js.org).

#### Installing
  Run `npm install blooket.js` to install Blooket.JS

#### Using
  To import the package, use
  ```js
  const Blooket = require("blooket.js")
  const game = new Blooket()
  ```
  Then, to join a game, use
  ```js
  game.join(pin,name,animal)
  ```
  Since blooket.js emits events, you can use `game.on` to catch them. Some examples are below
  ```js
  game.on("SocketConnect", function(s) {
    console.log("Connected to socket " + s.url)
  })
  game.on("DataReceived", function(s) {
    console.log("Connected to a " + s[1] + " game. The ID is " + s[0])
  })
  game.on("joined", function(player) {
    console.log(`joined as ${player.name}`)
  })
  game.on("GameStart", function() {
    console.log("The game is starting!")
  })
  game.on("QuestionStart", function(q) {
    game.answer(3) // The game.answer function answers the question, in this case, it will answer the third possible response.
  })
  game.on("Correct", function() {
    console.log("Yay! You answered correctly")
  })
  game.on("NextQuestion", function() {
    console.log("Question Completed!")
    game.startquestion() // this functions begins the next question
  })
  // The following are specific to Gold Quest
  game.on("GetGold", function() {
    console.log("Collect your gold")
    game.getgold(1) // This function says to collect the gold (or prize). Out of the 3 randomly chosen prizes (see the "goldchance.js" file), this will pick the 1st one.
  })
  game.on("Steal", function(data) {
    console.log("Stealing from the first player...")
    game.rob(Object.keys(data)[0]) // This function says to steal from the first player. You can use the players name, or Object.keys(data)[0], replacing zero with the player number.
  })
  game.on("Swap", function(data) {
    console.log("swapping with the first player...")
    game.swap(Object.keys(data)[0]) // This function says to swap with the first player. You can use the players name, or Object.keys(data)[0], replacing zero with the player number. The swap function does not do anything to you, but it does swap the other players score.
  })
  ```
