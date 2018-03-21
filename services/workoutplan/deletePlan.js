const Joi = require(`joi`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)
const workoutplanDelete = require(`../../lib/workoutplan/workoutplanDelete`)

const schemaParams = Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()

const deletePlan = async (request, response) => {
  try {
    const workoutplanId = request.params.workoutplanId
    const validationToken = await validateAccessToken(request.headers.authorization)
    const validateRequestParams = Joi.validate(workoutplanId, schemaParams)

    const deletion = await workoutplanDelete(workoutplanId, validationToken.user_id)

    return response
      .status(200)
      .send({ message: `Workoutplan deleted` })
  } catch (error) {
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = deletePlan
