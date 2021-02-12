function answerHandler(answer, self) {
  return new Promise(async(resolve, reject)=> {
  var index = self.CurrentIndex
  var question = self.questions[index]
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