const Joi = require(`joi`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)
const workoutplanGet = require(`../../lib/workoutplan/workoutplanGet`)
const workoutexerciseGetAll = require(`../../lib/workoutexercise/workoutexerciseGetAll`)

const schemaParams = Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()

const getPlan = async (request, response) => {
  try {
    const workoutplanId = request.params.workoutplanId
    const validationToken = await validateAccessToken(request.headers.authorization)
    const validateRequestParams = Joi.validate(workoutplanId, schemaParams)

    const plan = await workoutplanGet(workoutplanId, validationToken.user_id)
    const planExercises = await workoutexerciseGetAll(workoutplanId, validationToken.user_id)

    return response
      .status(200)
      .send({ workoutplan: {
        workoutplan_id: plan.workoutplan_id,
        customer_id: plan.customer_id,
        title: plan.title,
        description: plan.description,
        workoutexercises_list: planExercises 
      }})
  } catch (error) {
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = getPlan
