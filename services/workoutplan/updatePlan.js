const Joi = require(`joi`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)
const workoutplanUpdate = require(`../../lib/workoutplan/workoutplanUpdate`)

const schemaParams = Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
const schemaBody = Joi.object().keys({
  title: Joi.string().empty(``),
  description: Joi.string().empty(``),
  customer_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/)
})

const updatePlan = async (request, response) => {
  try {
    const workoutplanId = request.params.workoutplanId
    const validationToken = await validateAccessToken(request.headers.authorization)
    const validateParams = await Joi.validate(workoutplanId, schemaParams)
    const validateBody = await Joi.validate(request.body, schemaBody)

    const update = await workoutplanUpdate(workoutplanId, validationToken.user_id, request.body)

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

module.exports = updatePlan
