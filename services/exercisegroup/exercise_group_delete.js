const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const validateToken = require(`../../lib/helper/validateToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const exerciseGroupDelete = require(`../../lib/exercisegroup/exerciseGroupDelete`)

const config = require(`../../server/config`)

function deletingExerciseGroupFromDatabase (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateToken(request.headers.authorization)
      const validationParams = await Joi.validate(request.params.exercisegroupId, schema.exercise_group_delete.requestParams)

      const deletion = await exerciseGroupDelete(request.params.exercisegroupId, validateToken.relation_id)

      resolve(response
        .status(200)
        .send({ message: deletion.message })
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

module.exports = deletingExerciseGroupFromDatabase
