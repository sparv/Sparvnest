const Exercise = require(`../../models/Exercise`)

const exerciseUpdate = (exerciseId, data) => {
  return new Promise((resolve, reject) => {
    Exercise.update(data, { where: { exercise_id: exerciseId }})
      .then(affectedRows => {
        if (affectedRows === 0) {
          reject({
            name: `ResourceError`,
            message: `Exercise was not updated`
          })
        } else {
          resolve({ message: `Exercise updated` })
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

module.exports = exerciseUpdate
