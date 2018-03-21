const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const exerciseUpdate = require(`../../lib/exercise/exerciseUpdate`)

const config = require(`../../server/config`)

function updatingExerciseInDatabase (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateAccessToken(request.headers.authorization)
      const validationBody = await Joi.validate(request.body, schema.exercise_update.requestBody)
      const validationParams = await Joi.validate({
        exercise_id: request.params.exerciseId
      }, schema.exercise_update.requestParams)

      const update = await exerciseUpdate(request.params.exerciseId, request.body)

      resolve(response
        .status(200)
        .send({ message: update.message })
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

module.exports = updatingExerciseInDatabase
