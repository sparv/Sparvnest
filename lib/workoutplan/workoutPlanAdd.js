const WorkoutPlan = require(`../../models/WorkoutPlan`)

const workoutPlanAdd = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const creation = await WorkoutPlan.create(data)

      //should return complete data blob without modification
      resolve({
        message: `Workoutplan created`,
        workoutplan: {
          workoutplan_id: creation.workoutplan_id,
          title: creation.title,
          description: creation.description,
          customer_id: creation.customer_id
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

module.exports = workoutPlanAdd
