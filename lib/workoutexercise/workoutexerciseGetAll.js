const WorkoutExercise = require(`../../models/WorkoutExercise`)

const workoutExerciseGetAll = (workoutplanId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gathering = await WorkoutExercise.findAll({ where: {
        workoutplan_id: workoutplanId,
        user_id: userId
      }})

      const workoutexerciseList = gathering.map(item => {
        return {
          workoutexercise_id: item.workoutexercise_id,
          exercise_id: item.exercise_id,
          weight: item.weight,
          repetition: item.repetition
        }
      })

      resolve(workoutexerciseList)
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = workoutExerciseGetAll
