const Joi = require(`joi`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)
const workoutexerciseUpdate = require(`../../lib/workoutexercise/workoutexerciseUpdate`)

const schemaParams = Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
const schemaBody = Joi.object().keys({
  weight: Joi.number(),
  repetition: Joi.number().integer(),
})

const updateExerciseFromPlan = async (request, response) => {
  try {
    const workoutexerciseId = request.params.workoutexerciseId
    const validationToken = await validateAccessToken(request.headers.authorization)
    const validateParams = await Joi.validate(workoutexerciseId, schemaParams)
    const validateBody = await Joi.validate(request.body, schemaBody)

    const update = await workoutexerciseUpdate(workoutexerciseId, validationToken.user_id, request.body)

    return response
      .status(200)
      .send({ message: update.message })
  
  } catch (error) {
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = updateExerciseFromPlan
