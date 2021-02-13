/**
* @params {number} id - The game ID, used for retreived question data
* @returns {promise} - returns a promise containing the game question data
* @requires got
*/
const got = require('got')
function questions(id) {
  return new Promise(async(resolve, reject) => {
    res = await got(`https://www.blooket.com/api/games?gameId=${id}`)
    questiondata = JSON.parse(res.body)
    return resolve(questiondata)
  });
}
module.exports = questions
