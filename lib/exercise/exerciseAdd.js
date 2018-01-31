const Exercise = require(`../../models/Exercise`)

const exerciseAdd = (data) => {
  return new Promise((resolve, reject) => {
    Exercise.create(data)
      .then(exercise => {
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
        reject({
          status: 500,
          message: error
        })
      })
  })
}

module.exports = exerciseAdd
