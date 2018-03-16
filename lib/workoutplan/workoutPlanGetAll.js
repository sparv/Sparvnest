const WorkoutPlan = require(`../../models/WorkoutPlan`)

const workoutPlanGetAll = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gathering = WorkoutPlan.findAll({ where: {
        user_id: userId
      }})

      resolve({ workoutplan_list: gathering })
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = workoutPlanGetAll
