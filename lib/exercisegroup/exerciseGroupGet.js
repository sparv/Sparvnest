const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseGroupGet = (data) => {
  return new Promise((resolve, reject) => {
    ExerciseGroup.findOne({ where: data })
      .then(exerciseGroup => {
        if (exerciseGroup === null) {
          reject({
            status: 404,
            message: `Exercisegroup not found`
          })
        } else {
          resolve({
            status: 200,
            exercise: {
              exercisegroup_id: exercisegroup.exercisegroup_id,
              name: exercisegroup.name,
              description: exercisegroup.description
            }
          })
        }
      })
      .catch(error => {
        reject({
          status: 500,
          message: `Could not search for Exercisegroup`
        })
      })
  })
}

module.exports = exerciseGroupGet
