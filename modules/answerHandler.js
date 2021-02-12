function answerHandler(answer, self) {
  return new Promise(async(resolve, reject) => {
  console.log(self)
  var question = self.questions[self.CurrentIndex]
  console.log(question)
  if (question.correctAnswers.includes(question.answers[answer]) == true) {
    resolve(true)
  }
  else {
    resolve(false)
    }
  })
}
module.exports = answerHandler
