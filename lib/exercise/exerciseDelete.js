const Exercise = require(`../../models/Exercise`)

const exerciseDelete = (exerciseId) => {
  return new Promise((resolve, reject) => {
    Exercise.destroy({ where: { exercise_id: exerciseId }})
      .then(affectedRows => {
        if (affectedRows === 0) {
          reject({
            status: 400,
            message: `No Exercise deleted`
          })
        } else {
          resolve({
            status: 200,
            message: `Exercise deleted`
          })
        }
      })
      .catch(error => {
        console.error(error)
        reject({
          status: 500,
          message: error
        })
      })
  })
}

module.exports = exerciseDelete
