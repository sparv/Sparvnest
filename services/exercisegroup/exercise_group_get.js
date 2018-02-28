const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const validateToken = require(`../../lib/helper/validateToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const exerciseGroupGet = require(`../../lib/exercisegroup/exerciseGroupGet`)

const config = require(`../../server/config`)

function getExerciseGroup (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateToken(request.headers.authorization)
      const validationParams = await Joi.validate(request.params.exercisegroupId, schema.exercise_group_get.requestParams)

      const gathering = await exerciseGroupGet(request.params.exercisegroupId, validateToken.relation_id)

      resolve(response
        .status(200)
        .send({ exercisegroup: gathering.exercisegroup })
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

module.exports = getExerciseGroup
