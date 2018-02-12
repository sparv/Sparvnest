const ExerciseGroup = require(`../../models/ExerciseGroup`)
const Exercise = require(`../../models/Exercise`)

const exerciseGroupAdd = (data) => {
  return new Promise((resolve, reject) => {
    ExerciseGroup.create(data)
      .then(exercisegroup => {
        resolve({
          message: `Exercisegroup created`,
          exercisegroup: {
            exercisegroup_id: exercisegroup.exercisegroup_id,
            name: exercisegroup.name,
            description: exercisegroup.description
          }
        })
      })
      .catch(error => {
        reject({
          message: error
        })
      })
  })
}

module.exports = exerciseGroupAdd
