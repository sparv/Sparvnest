const Exercise = require(`../../models/Exercise`)
const ExerciseGroup = require(`../../models/ExerciseGroup`)

const exerciseAdd = (exerciseGroupId, data) => {
  return new Promise((resolve, reject) => {
    ExerciseGroup.findOne({ where: { exercisegroup_id: exerciseGroupId } })
      .then(group => {
        console.log(data)
        console.log(group.setItems)
        Exercise.create(data).then(exercise => {
          console.log(exercise)
          group.setItems(exercise)
            .then(status => {
              console.log(status)

              resolve({
                status: 200,
                exercise: {
                  exercise_id: exercise.exercise_id,
                  name: exercise.name,
                  level: exercise.level,
                  description: exercise.description
                }
              })
            })
        })
        // group.setItems({
        //   name: data.name,
        //   level: data.level,
        //   description: data.description
        // })
        //   .then(p => {
        //     console.log(p)
        //   })
        //   .catch(e => {
        //     console.error(e)
        //   })
      })
      // .setItems(data)
      // .then(exercise => {
      //   resolve({
      //     status: 200,
      //     exercise: {
      //       exercise_id: exercise.exercise_id,
      //       name: exercise.name,
      //       level: exercise.level,
      //       description: exercise.description
      //     }
      //   })
      // })
      .catch(error => {
        reject({
          status: 500,
          message: error
        })
      })
  })
}

module.exports = exerciseAdd
