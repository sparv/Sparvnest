const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const exerciseDelete = require(`../../lib/exercise/exerciseDelete`)

const config = require(`../../server/config`)

function exerciseGroupExerciseDelete (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateAccessToken(request.headers.authorization)
      const validationParams = await Joi.validate({
        exercise_id: request.params.exerciseId
      }, schema.exercise_group_exercise_delete.requestParams)

      const deletion = await exerciseDelete(request.params.exerciseId)

      resolve(response
        .status(200)
        .send({ message: deletion.message })
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

module.exports = exerciseGroupExerciseDelete
