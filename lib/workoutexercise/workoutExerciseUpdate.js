const WorkoutExercise = require(`../../models/WorkoutExercise`)

const workoutExericseUpdate = (workoutexerciseId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const update = await WorkoutExercise.update(data, { where: {
        workoutexercise_id: workoutexerciseId
      }})

      if (update === 0) reject({
        name: `ResourceError`,
        message: `Workoutexercise was not updated`
      })

      resolve({ message: `Workoutexercise updated` })
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = workoutPlanUpdate
