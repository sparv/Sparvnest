const Exercise = require(`../../models/Exercise`)

const exerciseUpdate = (exerciseId, data) => {
  return new Promise((resolve, reject) => {
    Exercise.update(data, { where: { exercise_id: exerciseId }})
      .then(affectedRows => {
        if (affectedRows === 0) {
          reject({
            status: 500,
            message: `User was not updated`
          })
        } else {
          resolve({
            status: 200,
            message: `Exercise updated`
          })
        }
      })
      .catch(error => {
        reject({
          status: 500,
          message: error
        })
      })
  })
}

module.exports = exerciseUpdate
