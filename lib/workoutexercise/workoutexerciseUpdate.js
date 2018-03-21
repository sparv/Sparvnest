const WorkoutExercise = require(`../../models/WorkoutExercise`)

const workoutexerciseUpdate = (workoutexerciseId, userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const update = await WorkoutExercise.update(data, { where: {
        workoutexercise_id: workoutexerciseId,
        user_id: userId
      }})

      if (update[0] === 0) reject({
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

module.exports = workoutexerciseUpdate
