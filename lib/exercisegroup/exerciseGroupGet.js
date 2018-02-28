const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseGroupGet = (exercisegroupId, relationId) => {
  return new Promise((resolve, reject) => {
    ExerciseGroup.findOne({ where: {
      exercisegroup_id: exercisegroupId,
      relation_id: relationId
    } })
      .then(exercisegroup => {
        if (exercisegroup === null) {
          reject({
            name: `ResourceError`,
            message: `Exercisegroup not found`
          })
        } else {
          resolve({
            exercisegroup: {
              exercisegroup_id: exercisegroup.exercisegroup_id,
              name: exercisegroup.name,
              description: exercisegroup.description
            }
          })
        }
      })
      .catch(error => {
        console.log(error)
        reject({
          name: `DatabaseError`,
          message: error
        })
      })
  })
}

module.exports = exerciseGroupGet
