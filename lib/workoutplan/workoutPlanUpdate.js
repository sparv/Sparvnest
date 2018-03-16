const WorkoutPlan = require(`../../models/WorkoutPlan`)

const workoutPlanUpdate = (workoutplan_id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const update = await WorkoutPlan.update(data, { where: {
        workoutplan_id: workoutplan_id
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
