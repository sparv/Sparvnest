const Exercise = require(`../../models/Exercise`)

const exerciseGetAll = (exercisegroupId) => {
  return new Promise((resolve, reject) => {
    console.log(exercisegroupId)
    Exercise.findAll({ where: { exercisegroup_id: exercisegroupId }})
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
          exercise_list: exerciseList
        })
      })
      .catch(error => {
        reject({
          message: error
        })
      })
  })
}

module.exports = exerciseGetAll
