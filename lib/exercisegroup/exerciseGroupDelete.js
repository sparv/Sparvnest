const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseGroupDelete = (exerciseGroupId, relationId) => {
  return new Promise((resolve, reject) => {
    ExerciseGroup.destroy({ where: {
      exercisegroup_id: exerciseGroupId,
      relation_id: relationId
    }})
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
        reject({
          name: `DatabaseError`,
          message: error
        })
      })
  })
}

module.exports = exerciseGroupDelete
