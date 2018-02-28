const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseGroupUpdate = (exerciseGroupId, relationId, data) => {
  return new Promise((resolve, reject) => {
    console.log(exerciseGroupId)
    ExerciseGroup.update(data, { where: {
      exercisegroup_id: exerciseGroupId,
      relation_id: relationId
    }})
      .then(affectedRows => {
        console.log(affectedRows)
        if (affectedRows === 0) {
          reject({
            name: `ResourceError`,
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
          name: `DatabaseError`,
          message: error
        })
      })
  })
}

module.exports = exerciseGroupUpdate
