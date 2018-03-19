const WorkoutPlan = require(`../../models/WorkoutPlan`)

const workoutPlanGetAll = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const plans = WorkoutPlan.findAll({ where: {
        user_id: userId
      }})

      resolve(plans)
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = workoutPlanGetAll
