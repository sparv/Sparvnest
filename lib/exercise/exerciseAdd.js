const Exercise = require(`../../models/Exercise`)

const exerciseAdd = (data) => {
  return new Promise((resolve, reject) => {
    Exercise.create(data)
      .then(() => {
        resolve({
          status: 200,
          exercise: {
            exercise_id: exercise.exercise_id,
            name: exercise.name,
            level: exercise.level,
            description: exercise.description
          }
        })
      })
      .catch(error => {
        console.error(error)
        reject({
          status: 500,
          message: `Exercise could not be created`
        })
      })
  })

}

module.exports = exerciseAdd
