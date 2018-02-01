const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseGroupDelete = (exerciseGroupId) => {
  return new Promise((resolve, reject) => {
    ExerciseGroup.destroy({ where: { exercisegroup_id: exerciseGroupId }})
      .then(affectedRows => {
        if (affectedRows === 0) {
          reject({
            message: `No Exercisegroup deleted`
          })
        } else {
          resolve({
            message: `Exercisegroup deleted`
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
}

module.exports = exerciseGroupDelete
