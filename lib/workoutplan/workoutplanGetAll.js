const WorkoutPlan = require(`../../models/WorkoutPlan`)

const workoutPlanGetAll = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const plans = WorkoutPlan.findAll({ where: {
        user_id: userId
      }})

      const planList = plans.map(item => {
        return {
          workoutplan_id: item.workoutplan_id,
          customer_id: item.customer_id,
          user_id: item.user_id,
          title: item.title,
          description: item.description,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }
      })

      resolve(planList)
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = workoutPlanGetAll
