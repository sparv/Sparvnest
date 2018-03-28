const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const workoutplanGetAll = require(`../../lib/workoutplan/workoutplanGetAll`)
const workoutexerciseGetAll = require(`../../lib/workoutexercise/workoutexerciseGetAll`)

const getAllPlans = (request, response) => {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateAccessToken(request.headers.authorization)
      const gathering = await workoutplanGetAll(validationToken.user_id)

      const planList = await Promise.all(gathering.map(async item => {
        const workoutexerciseList = await workoutexerciseGetAll(item.workoutplan_id, validationToken.user_id)
        item[`workoutexercise_count`] = workoutexerciseList.length
        console.log(item)

        return item
      }))

      resolve(response
        .status(200)
        .send({ workoutplans: planList })
      )
    } catch (error) {
      const mapping = errorMap(error)

      reject(response
        .status(mapping.status)
        .send(mapping)
      )
    }
  })
}

module.exports = getAllPlans
