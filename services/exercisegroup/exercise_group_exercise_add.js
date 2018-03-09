const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const exerciseGroupGet = require(`../../lib/exercisegroup/exerciseGroupGet`)
const exerciseAdd = require(`../../lib/exercise/exerciseAdd`)

const config = require(`../../server/config`)

function exerciseGroupExerciseAdd (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateAccessToken(request.headers.authorization)
      const validationParams = await Joi.validate({ exercisegroup_id: request.params.exercisegroupId }, schema.exercise_group_exercise_add.requestParams)
      const validationBody = await Joi.validate(request.body, schema.exercise_add.requestBody)

      const gathering = await exerciseGroupGet(request.params.exercisegroupId, validationToken.relation_id)
      const creation = await exerciseAdd(request.params.exercisegroupId, request.body)

      resolve(response
        .status(200)
        .send({
          message: creation.message,
          exercise: creation.exercise
        })
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

module.exports = exerciseGroupExerciseAdd
