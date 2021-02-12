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
