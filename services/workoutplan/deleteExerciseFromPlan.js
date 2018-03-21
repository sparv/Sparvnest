const Joi = require(`joi`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const schemaParams = Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()

const deleteExerciseFromPlan = async (request, response) => {
  try {
    const workoutexerciseId = request.params.workoutexerciseId
    const validationToken = await validateAccessToken(request.headers.authorization)
    const validateParams = await Joi.validate(workoutexerciseIdId, schemaParams)
  
  } catch (error) {
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exporst = deleteExerciseFromPlan
