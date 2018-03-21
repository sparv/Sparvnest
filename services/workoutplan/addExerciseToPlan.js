const Joi = require(`joi`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)
const workoutexerciseAdd = require(`../../lib/workoutexercise/workoutexerciseAdd`)

const schemaParams = Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
const schemaBody = Joi.object().keys({
  weight: Joi.number().required(),
  repetition: Joi.number().integer().required(),
  exercise_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
})

const addExerciseToPlan = async (request, response) => {
  try {
    const workoutplanId = request.params.workoutplanId
    const validationToken = await validateAccessToken(request.headers.authorization)
    const validateParams = await Joi.validate(workoutplanId, schemaParams)
    const validateBody = await Joi.validate(request.body, schemaBody)

    const creation = await workoutexerciseAdd(workoutplanId, validationToken.user_id, request.body)

    return response
      .status(200)
      .send({
        message: creation.message,
        workoutexercise: creation.workoutexercise
      })
  } catch (error) {
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = addExerciseToPlan
