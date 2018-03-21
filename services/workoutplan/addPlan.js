const Joi = require(`joi`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)
const workoutplanAdd = require(`../../lib/workoutplan/workoutplanAdd`)

const schemaRequestBody = {
  customer_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required(),
  user_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required(),
  title: Joi.string().required(),
  description: Joi.string().empty('')
}

const addPlan = async (request, response) => {
  try {
    const validationToken = await validateAccessToken(request.headers.authorization)
    const validationBody = await Joi.validate(request.body, schemaRequestBody)

    const creation = await workoutplanAdd(request.body)

    return response
      .status(200)
      .send({
        message: creation.message,
        workoutplan: creation.workoutplan
      })
  } catch (error) {
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = addPlan
