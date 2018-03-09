const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const exerciseGroupGet = require(`../../lib/exercisegroup/exerciseGroupGet`)
const exerciseGet = require(`../../lib/exercise/exerciseGet`)

const config = require(`../../server/config`)

function getSingleExercisesFromDatabase (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateAccessToken(request.headers.authorization)
      const validationParams = await Joi.validate({
        exercisegroup_id: request.params.exercisegroupId,
        exercise_id: request.params.exerciseId
      }, schema.exercise_get.requestParams)

      const gatheringGroup = await exerciseGroupGet(request.params.exercisegroupId, validationToken.relation_id)
      const gathering = await exerciseGet(request.params.exercisegroupId, request.params.exerciseId)

      resolve(response
        .status(200)
        .send({ exercise: gathering.exercise })
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

module.exports = getSingleExercisesFromDatabase
