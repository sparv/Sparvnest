const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const exerciseGroupGet = require(`../../lib/exercisegroup/exerciseGroupGet`)
const exerciseGetAll = require(`../../lib/exercise/exerciseGetAll`)

const config = require(`../../server/config`)

function getAllExercisesFromDatabase (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateAccessToken(request.headers.authorization)
      const validationParams = await Joi.validate({ exercisegroup_id: request.params.exercisegroupId }, schema.exercise_all_get.requestParams)

      const gatheringGroup = await exerciseGroupGet(request.params.exercisegroupId, validationToken.user_id)
      const gathering = await exerciseGetAll(request.params.exercisegroupId)

      resolve(response
        .status(200)
        .send({ exercise_list: gathering.exercise_list })
      )
    } catch (error) {
      console.log(error)
      const mapping = errorMap(error)

      reject(response
        .status(mapping.status)
        .send(mapping)
      )
    }
  })
}

module.exports = getAllExercisesFromDatabase
