const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)
const exerciseGroupAdd = require(`../../lib/exercisegroup/exerciseGroupAdd`)

const addingExerciseGroupToDatabase = async (request, response) => {
  try {
    const validationToken = await validateAccessToken(request.headers.authorization)
    const validationBody = await Joi.validate(request.body, schema.exercise_group_add.requestBody)

    const creation = await exerciseGroupAdd({
      name: request.body.name,
      description: request.body.description,
      exercises: [],
      user_id: validationToken.user_id
    })

    return response
      .status(200)
      .send({
        message: creation.message,
        exercisegroup: creation.exercisegroup
      })
  } catch (error) {
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = addingExerciseGroupToDatabase
