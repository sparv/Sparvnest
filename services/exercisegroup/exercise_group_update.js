const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const validateToken = require(`../../lib/helper/validateToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const exerciseGroupUpdate = require(`../../lib/exercisegroup/exerciseGroupUpdate`)

const config = require(`../../server/config`)

function updatingExerciseGroupInDatabase (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateToken(request.headers.authorization)
      const validationParams = await Joi.validate({ exercisegroup_id: request.params.exercisegroupId }, schema.exercise_group_update.requestParams)
      const validationBody = await Joi.validate(request.body, schema.exercise_group_update.requestBody)

      const update = await exerciseGroupUpdate(request.params.exercisegroupId, validationToken.relation_id, request.body)

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
