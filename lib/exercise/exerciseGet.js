const Exercise = require(`../../models/Exercise`)

const exerciseGet = (exercisegroupId, exerciseId) => {
  return new Promise((resolve, reject) => {
    Exercise.findOne({ where: {
      exercise_id: exerciseId,
      exercisegroup_id: exercisegroupId
    } })
      .then(exercise => {
        if (exercise === null) {
          reject({
            message: `Exercise not found`
          })
        } else {
          resolve({
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
          message: `Could not search for Exercise`
        })
      })
  })
}

module.exports = exerciseGet
