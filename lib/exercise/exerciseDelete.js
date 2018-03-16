const Exercise = require(`../../models/Exercise`)

const exerciseDelete = (exerciseId) => {
  return new Promise((resolve, reject) => {
    Exercise.destroy({ where: { exercise_id: exerciseId }})
      .then(affectedRows => {
        if (affectedRows === 0) {
          reject({
            name: `ResourceError`,
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
          name: `DatabaseError`,
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
