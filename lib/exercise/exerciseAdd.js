const sequelize = require(`sequelize`)

const Exercise = require(`../../models/Exercise`)
const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseAdd = (exerciseGroupId, data) => {
  return new Promise((resolve, reject) => {
    ExerciseGroup.findOne({ where: { exercisegroup_id: exerciseGroupId } })
      .then(group => {
        Exercise.create(data).then(exercise => {
          group.setItems(exercise)
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

module.exports = exerciseAdd
