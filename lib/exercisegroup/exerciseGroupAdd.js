const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseGroupAdd = (data) => {
  return new Promise((resolve, reject) => {
    ExerciseGroup.create(data)
      .then(exercisegroup => {
        resolve({
          message: `Exercisegroup created`,
          exercisegroup: {
            exercisegroup_id: exercisegroup.exercisegroup_id,
            name: exercisegroup.name,
            description: exercisegroup.description,
            color: exercisegroup.color
          }
        })
      })
      .catch(error => {
        reject({
          name: `DatabaseError`,
          message: error
        })
      })
  })
}

module.exports = exerciseGroupAdd
