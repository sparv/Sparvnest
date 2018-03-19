const WorkoutExercise = require(`../../models/WorkoutExercise`)

const workoutExerciseDelete = (workoutexerciseId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletion = await WorkoutPlan.destroy({ where: { workoutexerciseId: workoutexercise_id }})
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

module.exports = workoutExericseDelete
