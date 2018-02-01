const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseGroupGet = (exercisegroupId) => {
  return new Promise((resolve, reject) => {
    ExerciseGroup.findOne({ where: { exercisegroup_id: exercisegroupId } })
      .then(exercisegroup => {
        if (exercisegroup === null) {
          reject({
            status: 404,
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
          message: `Could not search for Exercisegroup`
        })
      })
  })
}

module.exports = exerciseGroupGet
