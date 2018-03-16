const WorkoutExercise = require(`../../models/WorkoutExercise`)

const workoutExerciseAdd = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const creation = await WorkoutExercise.create(data)

      resolve({ message: `WorkoutExercise added` })
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = workoutExerciseAdd
