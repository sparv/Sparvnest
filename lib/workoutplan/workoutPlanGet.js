const WorkoutPlan = require(`../../models/WorkoutPlan`)

const workoutPlanGet = (workoutplanId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gathering = WorkoutPlan.findOne({ where: {
        workoutplan_id: workoutplanId,
        user_id: userId
      }})

      if (gathering === null) reject({
        name: `ResourceError`,
        message: `Workoutplan not found`
      })

      resolve({ workoutplan: gathering })
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = workoutPlanGet
