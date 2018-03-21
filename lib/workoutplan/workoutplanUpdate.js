const WorkoutPlan = require(`../../models/WorkoutPlan`)

const workoutPlanUpdate = (workoutplanId, userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const update = await WorkoutPlan.update(data, { where: {
        workoutplan_id: workoutplanId,
        user_id: userId
      }})

      if (update === 0) reject({
        name: `ResourceError`,
        message: `Workoutplan was not updated`
      })

      resolve({ message: `Workoutplan updated` })
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = workoutPlanUpdate
