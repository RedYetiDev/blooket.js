/**
  * @param {number[1-4]} answer - The answer to send
  * @param {object} self - The client
*/
function answerHandler(answer, self) {
  return new Promise(async(resolve, reject) => {
  var question = self.questions[self.CurrentIndex]
  if (question.correctAnswers.includes(question.answers[answer]) == true) {
    resolve(true)
  }
  else {
    resolve(false)
    }
  })
}
module.exports = answerHandler
