const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseGroupUpdate = (exerciseGroupId, data) => {
  return new Promise((resolve, reject) => {
    ExerciseGroup.update(data, { where: { exercisegroup_id: exerciseGroupId }})
      .then(affectedRows => {
        if (affectedRows === 0) {
          reject({
            status: 500,
            message: `Exercisegroup was not updated`
          })
        } else {
          resolve({
            status: 200,
            message: `Exercisegroup updated`
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

module.exports = exerciseGroupUpdate
