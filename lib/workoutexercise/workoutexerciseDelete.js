const WorkoutExercise = require(`../../models/WorkoutExercise`)

const workoutexerciseDelete = (workoutexerciseId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletion = await WorkoutExercise.destroy({ where: {
        workoutexercise_id: workoutexerciseId,
        user_id: userId
      }})
      if (deletion === 0) {
        reject({
          name: `DatabaseError`,
          message: `No Workoutexercise removed`
        })
      }

      resolve({ message: `Workoutexercise removed`})
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = workoutexerciseDelete
