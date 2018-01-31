const Exercise = require(`../../models/Exercise`)

const exerciseGetAll = () => {
  return new Promise((resolve, reject) => {
    Exercise.findAll()
      .then(exercises => {
        const exerciseList = exercises.map(exercise => {
          return {
            exercise_id: exercise.exercise_id,
            name: exercise.name,
            level: exercise.level,
            description: exercise.description
          }
        })

        resolve({
          status: 200,
          exercise_list: exerciseList
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

module.exports = exerciseGetAll
