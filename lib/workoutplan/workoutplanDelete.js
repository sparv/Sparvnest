const WorkoutPlan = require(`../../models/WorkoutPlan`)

const workoutPlanDelete = (workoutplanId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletion = await WorkoutPlan.destroy({ where: {
        workoutplan_id: workoutplanId,
        user_id: userId
      }})

      if (deletion === 0) {
        reject({
          name: `DatabaseError`,
          message: `No Workoutplan deleted`
        })
      }

      resolve({ message: `Workoutplan deleted`})
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = workoutPlanDelete
