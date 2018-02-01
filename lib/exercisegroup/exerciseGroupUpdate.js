const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseGroupUpdate = (exerciseGroupId, data) => {
  return new Promise((resolve, reject) => {
    console.log(exerciseGroupId)
    ExerciseGroup.update(data, { where: { exercisegroup_id: exerciseGroupId }})
      .then(affectedRows => {
        console.log(affectedRows)
        if (affectedRows === 0) {
          reject({
            message: `Exercisegroup was not updated`
          })
        } else {
          resolve({
            message: `Exercisegroup updated`
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

module.exports = exerciseGroupUpdate
