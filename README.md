# Blooket.JS
## Version 1.0.0
#### Table Of Contents
  - [Features](#features)
  - [Semi Bugs](#sbugs)
  - [Bugs](#bugs)
  - [Documentation](#docs)
    - [Installing](#install)
    - [Using](#use)
      - [Options](#options)
      - [Joining](#use)
      - [Functions](#functions)
        - [Connect](#connect)
        - [Join](#joinfunction)
        - [Start Question](#startquestionfunction)
        - [answer](#answer)
        - [Get Gold](#getgoldfunction)
        - [Swap](#swapfunction)
        - [Rob](#rob)
      - [Events](#events)
        - [Joined](#joined)
        - [GameStart](#gamestart)
        - [QuestionStart](#questionstart)
        - [Correct](#correct)
        - [GetGold](#getgold)
        - [Swap](#swap)
        - [Steal](#steal)
      - [Examples](#examples)
        - [answer](#answerexample)
        - [GetGold](#gg)
        - [Swap and Steal](#ss)
        - [NextQuestion](#nq)
  - [Upcoming Features](#up)
  - [Other Projects](#other)

### <a id="features"></a>Features
  - Joining games
  - Playing games
  - Auto answer (can be set to do it correctly, see #2)
  - Can use "Prizes", like the normal client

### <a id="sbugs"></a>Semi-Bugs
###### (Bugs that are not bad)
  - Answering takes 1 second exactly
  - If a player swaps with the client, the client does not lose any gold
### <a id="bugs"></a>Bugs
  - Client swapping does not work (Only for Gold Quest)
  - Client can't join mid-game (Not Applicable for Battle Royale)

### <a id="docs"></a>Documentation

#### <a id="install"></a>Installing
  Run `npm install blooket.js` to install Blooket.JS

#### <a id="use"></a>Using
  To import the package, use
  ```js
  const Blooket = require("blooket.js")
  const game = new Blooket()
  ```
  The `Blooket()` class can have options with it. The options you can use are below
  <a id="options"></a>
  | Option     | Description                                                                | Type                              | Values                | Default Value |
  |------------|----------------------------------------------------------------------------|-----------------------------------|-----------------------|---------------|
  | repeat     | Once the client answers all questions, will it start over                  | Boolean                           | true/false            | true          |
  | blookcash  | (Factory Mode Only) How much cash each block should give.                  | Integer                           | Any number            | 100           |
  | blooktime  | (Factory Mode Only) How long between the books generating cash             | Integer (milliseconds)            | Any Number            | 1000          |
  | answertime | (Battle Royale Mode Only) How long it took the client to answer            | Integer (milliseconds 1 to 20000) | Any number 1 to 20000 | 1             |
  | cafebonus  | (Cafe Mode Only) The amount of cash to give the client after every answer. | Integer                           | Any number            | 100           |

  The options should be formatted as a JSON object like such
  ```js
  const game = new Blooket({
    option: value
  })
  ```

  ## <a id="join"></a>Joining Games
  To join a game, run the following command
  ```js
  game.join(pin,name,animal)
  ```

  ## <a id="functions"></a>Functions
  - #### <a id="joinfunction"></a>join(pin, name, animal)
    This join function is the main function run by the user,
    It returns the events listed in the events section

  - #### <a id="connect"></a>connect()
    The connect function is run by join() function, as shown in the `blooket.js` file. It connected the user to the socket and game.

  - #### <a id="startquestionfunction"></a>startquestion()
    The startquestion function is used after `NextQuestion` is emited (see `NextQuestion` in `Events` and `NextQuestion` in `Examples`), it is used to start the next question.

  - #### <a id="answer"></a>answer(a)
    The answer function is used to answer the question. the `a` variable can be a number 1 through 4. The answer function is called by the user after `QuestionStart` is emitted. (See `QuestionStart` in `Events` and `answer` in `Examples`).

  - #### <a id="getgoldfunction"></a>getgold(p)
    (Only in Gold Quest) The getgold function is used to collect your prize. The `p` variable can by a number 1 through 3. The prizes you can get are randomly selected (see `modules/goldchance.js`). This function is run when the user handles the `GetGold` event. (See `GetGold` in `Events`).

  - #### <a id="swapfunction"></a>swap(player)
    (Only in Gold Quest) The swap function is used to swap with a player. The `player` variable should be a name of a player in the game, or a `Object.keys()` function like `Object.keys({variable})[0]` replacing `0` with a number 0-through the amount of players subtracted by 1 (ex: 20 players means number 0 through 19). It is used while handling the `Swap` event (see `Swap` in `Events` and `Swap and Steal` in `Examples`).

  - #### <a id="rob"></a>rob(player)
      (Only in Gold Quest) The rob function is used to steal from a player. The `player` variable should be a name of a player in the game, or a `Object.keys()` function like `Object.keys({variable})[0]` replacing `0` with a number 0-through the amount of players subtracted by 1 (ex: 20 players means number 0 through 19). It is used while handling the `Steal` event (see `Steal` in `Events` and `Swap and Steal` in `Examples`).

  ## <a id="events"></a>Events
  The Blooket.JS class emits events at different times. Below is a brief explanation of the events

  - #### <a id="joined"></a>Joined
    This is emitted when the client joins the game

  - #### <a id="gamestart"></a>GameStart
    The GameStart event is emitted when the game begins, this event does not work in Battle Royale Mode.

  - #### <a id="questionstart"></a>QuestionStart
    The QuestionStart event is emitted when a question begins. While handling this event, it is required to run the `game.answer()` function.

  - #### <a id="correct"></a>Correct
    The Correct event is emitted when a question is answered correctly.

  - #### <a id="getgold"></a>GetGold
    The GetGold event is emitted when a player gets a question correct, and they are playing in gold quest mode. When handling this event, it is required to run the `game.getgold()` function.

  - #### <a id="swap"></a>Swap
    The Swap event is emitted when the `game.getgold()` function returns `swap` as the prize. for more prize details, see the `modules/goldchance.js` file. When handling this event, it is required to run the `game.swap()` function. Returns a list of players

  - #### <a id="Steal"></a>Steal
    The Steal event is emitted similarly to the Swap event, except instead running `game.swap()`, it is required to run `game.rob()`. Returns a list of players

  - #### <a id="NextQuestion"></a>NextQuestion
    The NextQuestion event is emitted when the question has ended, and the prizes (gold, cash, blooks, etc.) have been processed, when handling this event, this is required to run the `game.startquestion()` function.

  - #### <a id="debug"></a>Debug Events
    - ##### <a id="socketconnect"></a>SocketConnect
      The SocketConnect event is emitted once the client connects to the Blooket.JS socket.

  ## <a id="examples"></a>Examples
  - <a id="answerexample"></a>Answer
  ```js
  game.on("QuestionStart", function() {
    game.answer(1) // can be 1,2,3,4
  })
  ```
  - <a id="gg"></a>GetGold
  ```js
  game.on("GetGold", function() {
    game.getgold(1) // can be 1,2,3
  })
  ```
  - <a id="ss"></a>Swap and Steal
  ```js
  game.on("Swap", function(p) {
    game.swap(Object.keys(p)[0])
  })
  // Or
  game.on("Steal", function(p) {
    game.rob(Object.keys(p)[0])
  })
  ```
  - <a id="nq"></a>NextQuestion
  ```js
  game.on("NextQuestion", function() {
    game.startquestion()
  })
  ```
## <a id="up"></a>Upcoming Features
  - Classic Game Mode
  - `Powerups/Glitch` support in Factory Mode
  - And more

## <a id="other"></a>My Other Projects
Some other projects I have created and worked on:
- The First Transcontinental Railroad - [Website](https://redyetidev.github.io/First-Transcontinental-Railroad), [Repo](https://github.com/RedYetiDev/First-Transcontinental-Railroad)

    A website with information on the First Transcontinental Railroad, also good for a website example. (Uses examples from [w3schools](https://www.w3schools.com).)

- Blooket API - [Website](https://redyetidev.github.io/Blooket-API), [Repo](https://github.com/RedYetiDev/Blooket-API)

    Similar to this project, but online, it is still buggy.
- EmbedCode - [Website](https://redyetidev.github.io/embedCode), [Repo](https://github.com/redyetidev/embedCode)

  EmbedCode in a website that allows to embed your source code into an iframe, with syntax highlighting and line numbering. Check the repo for more info.
