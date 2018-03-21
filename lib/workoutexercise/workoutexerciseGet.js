const WorkoutExercise = require(`../../models/WorkoutExercise`)

const workoutExerciseGet = (workoutexerciseId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gathering = WorkoutExercise.findOne({ where: {
        workoutexercise_id: workoutexerciseId,
        user_id: userId
      }})

      if (gathering === null) reject({
        name: `ResourceError`,
        message: `Workoutexercise not found`
      })

      resolve({ workoutexercise: {
        exercise_id: gathering.exercise_id,
        weight: gathering.weight,
        repetition: gathering.repetition
      }})
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = workoutExerciseGet
