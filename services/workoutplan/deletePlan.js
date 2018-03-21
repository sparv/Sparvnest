const Joi = require(`joi`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)
const workoutplanDelete = require(`../../lib/workoutplan/workoutplanDelete`)
const workoutexerciseGetAll = require(`../../lib/workoutexercise/workoutexerciseGetAll`)
const workoutexerciseDelete = require(`../../lib/workoutexercise/workoutexerciseDelete`)

const schemaParams = Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()

const deletePlan = async (request, response) => {
  try {
    const workoutplanId = request.params.workoutplanId
    const validationToken = await validateAccessToken(request.headers.authorization)
    const validateRequestParams = await Joi.validate(workoutplanId, schemaParams)

    const gatheringExercises = await workoutexerciseGetAll(workoutplanId, validationToken.user_id)

    for (const item of gatheringExercises) {
      await workoutexerciseDelete(item.workoutexercise_id, validationToken.user_id)
    }

    const deletion = await workoutplanDelete(workoutplanId, validationToken.user_id)

    return response
      .status(200)
      .send({ message: `Workoutplan deleted` })
  } catch (error) {
    console.log(error)
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = deletePlan
