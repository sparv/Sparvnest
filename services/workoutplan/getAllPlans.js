const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const workoutplanGetAll = require(`../../lib/workoutplan/workoutplanGetAll`)

const getAllPlans = (request, response) => {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateAccessToken(request.headers.authorization)
      const gathering = await workoutplanGetAll(validationToken.user_id)

      resolve(response
        .status(200)
        .send({ workoutplans: gathering })
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
