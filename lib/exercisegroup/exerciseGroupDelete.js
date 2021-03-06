const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseGroupDelete = (exerciseGroupId, relationId) => {
  return new Promise((resolve, reject) => {
    ExerciseGroup.destroy({ where: {
      exercisegroup_id: exerciseGroupId,
      user_id: relationId
    }})
      .then(affectedRows => {
        if (affectedRows === 0) {
          reject({
            name: `DatabaseError`,
            message: `No Exercisegroup deleted`
          })
        } else {
          resolve({
            message: `Exercisegroup deleted`
          })
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

module.exports = exerciseGroupDelete
