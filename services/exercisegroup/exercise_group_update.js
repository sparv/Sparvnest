const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const exerciseGroupUpdate = require(`../../lib/exercisegroup/exerciseGroupUpdate`)

function updatingExerciseGroupInDatabase (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateAccessToken(request.headers.authorization)
      const validationParams = await Joi.validate({ exercisegroup_id: request.params.exercisegroupId }, schema.exercise_group_update.requestParams)
      const validationBody = await Joi.validate(request.body, schema.exercise_group_update.requestBody)

      const update = await exerciseGroupUpdate(request.params.exercisegroupId, validationToken.user_id, request.body)

      resolve(response
        .status(200)
        .send({ message: update.message })
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

module.exports = updatingExerciseGroupInDatabase
