const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const validateToken = require(`../../lib/helper/validateToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const exerciseGroupGet = require(`../../lib/exercisegroup/exerciseGroupGet`)
const exerciseDelete = require(`../../lib/exercise/exerciseDelete`)

const config = require(`../../server/config`)

function exerciseGroupExerciseDelete (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateToken(request.headers.authorization)
      const validationParams = await Joi.validate({
        exercisegroup_id: request.params.exercisegroupId,
        exercise_id: request.params.exerciseId
      }, schema.exercise_group_exercise_delete.requestParams)

      const gathering = await exerciseGroupGet(request.params.exercisegroupId, validationToken.relation_id)
      const deletion = await exerciseDelete(request.params.exerciseId, request.params.exercisegroupId)

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

module.exports = exerciseGroupExerciseDelete
