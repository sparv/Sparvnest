const WorkoutExercise = require(`../../models/WorkoutExercise`)

const workoutExerciseGetAll = (workoutplanId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gathering = await WorkoutExercise.findAll({ where: {
        workoutplan_id: workoutplanId,
        user_id: userId
      }})

      resolve(gathering)
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = workoutExerciseGetAll
