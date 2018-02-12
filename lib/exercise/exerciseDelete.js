const Exercise = require(`../../models/Exercise`)
const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseDelete = (exerciseId, exercisegroupId) => {
  return new Promise((resolve, reject) => {
    Exercise.destroy({ where: {
      exercise_id: exerciseId,
      exercisegroup_id: exercisegroupId
    }})
      .then(affectedRows => {
        if (affectedRows === 0) {
          reject({
            message: `No Exercise deleted`
          })
        } else {
          resolve({
            message: `Exercise deleted`
          })
        }
      })
      .catch(error => {
        console.error(error)
        reject({
          message: error
        })
      })
  })
  .catch(error => {
    reject({
      message: error
    })
  })
}

module.exports = exerciseDelete
