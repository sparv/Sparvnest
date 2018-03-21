const WorkoutExercise = require(`../../models/WorkoutExercise`)

const workoutExerciseAdd = (workoutplanId, userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const creation = await WorkoutExercise.create({
        workoutplan_id: workoutplanId,
        user_id: userId,
        exercise_id: data.exercise_id,
        weight: data.weight,
        repetition: data.repetition
      })

      resolve({
        message: `WorkoutExercise added`,
        workoutexercise: {
          workoutplan_id: creation.workoutplan_id,
          workoutexercise_id: creation.workoutexercise_id,
          user_id: creation.user_id,
          exercise_id: creation.exercise_id,
          weight: creation.weight,
          repetition: creation.repetition
        }
      })
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = workoutExerciseAdd
