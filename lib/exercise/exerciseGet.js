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
            name: `ResourceError`,
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
          name: `DatabaseError`,
          message: error
        })
      })
  })
}

module.exports = exerciseGet
