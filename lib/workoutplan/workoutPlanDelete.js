const WorkoutPlan = require(`../../models/WorkoutPlan`)

const workoutPlanDelete = (plan_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletion = await WorkoutPlan.destroy({ where: { plan_id: plan_id }})
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
