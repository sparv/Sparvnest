const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseGroupAdd = (data) => {
  return new Promise((resolve, reject) => {
    ExerciseGroup.create(data)
      .then(exercisegroup => {
        resolve({
          status: 200,
          exercise: {
            exercisegroup_id: exercisegroup.exercisegroup_id,
            name: exercisegroup.name,
            description: exercisegroup.description
          }
        })
      })
      .catch(error => {
        reject({
          status: 500,
          message: error
        })
      })
  })
}

module.exports = exerciseGroupAdd
