const Exercise = require(`../../models/Exercise`)

const exerciseGet = (data) => {
  return new Promise((resolve, reject) => {
    Exercise.findOne({ where: data })
      .then(exercise => {
        if (exercise === null) {
          reject({
            status: 404,
            message: `Exercise not found`
          })
        } else {
          resolve({
            status: 200,
            exercise: {
              exercise_id: exercise.exercise_id,
              name: exercise.name,
              level: exercise.level,
              description: exercise.description
            }
          })
        }
      })
      .catch(error => {
        reject({
          status: 500,
          message: `Could not search for Exercise`
        })
      })
  })
}

module.exports = exerciseGet
