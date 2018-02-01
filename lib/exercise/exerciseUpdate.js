const Exercise = require(`../../models/Exercise`)

const exerciseUpdate = (exerciseId, exercisegroupId, data) => {
  return new Promise((resolve, reject) => {
    Exercise.update(data, {
      where:
        {
          exercise_id: exerciseId,
          exercisegroup_id: exercisegroupId
        }
      })
      .then(affectedRows => {
        if (affectedRows === 0) {
          reject({
            message: `User was not updated`
          })
        } else {
          resolve({
            message: `Exercise updated`
          })
        }
      })
      .catch(error => {
        reject({
          message: error
        })
      })
  })
}

module.exports = exerciseUpdate
