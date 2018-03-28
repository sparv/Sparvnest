const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const exerciseGroupGet = require(`../../lib/exercisegroup/exerciseGroupGet`)
const exerciseGetAll = require(`../../lib/exercise/exerciseGetAll`)

const config = require(`../../server/config`)

function getExerciseGroup (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateAccessToken(request.headers.authorization)
      const validationParams = await Joi.validate({ exercisegroup_id: request.params.exercisegroupId }, schema.exercise_group_get.requestParams)

      const gathering = await exerciseGroupGet(request.params.exercisegroupId, validationToken.user_id)
      const exercises = await exerciseGetAll(request.params.exercisegroupId)

      const group = gathering.exercisegroup
      group[`exercises`] = exercises.exercise_list
      group[`exercise_count`] = group.exercises.length

      resolve(response
        .status(200)
        .send({ exercisegroup: group })
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
