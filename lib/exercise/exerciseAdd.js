const sequelize = require(`sequelize`)

const Exercise = require(`../../models/Exercise`)

const exerciseAdd = (exerciseGroupId, data) => {
  return new Promise((resolve, reject) => {
    Exercise.create(data).then(exercise => {
      exercise.update({exercisegroup_id: exerciseGroupId})
        .then(exercisegroup => {
          resolve({
            message: `Exercise added`,
            exercise: {
              exercise_id: exercise.exercise_id,
              name: exercise.name,
              level: exercise.level,
              description: exercise.description,
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
  })
}

module.exports = exerciseAdd
