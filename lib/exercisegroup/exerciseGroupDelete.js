const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseGroupDelete = (exerciseGroupId) => {
  return new Promise((resolve, reject) => {
    ExerciseGroup.destroy({ where: { exercisegroup_id: exerciseGroupId }})
      .then(affectedRows => {
        if (affectedRows === 0) {
          reject({
            status: 400,
            message: `No Exercisegroup deleted`
          })
        } else {
          resolve({
            status: 200,
            message: `Exercisegroup deleted`
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

module.exports = exerciseGroupDelete
