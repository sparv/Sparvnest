const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const validateToken = require(`../../lib/helper/validateToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const exerciseGroupAdd = require(`../../lib/exercisegroup/exerciseGroupAdd`)

const config = require(`../../server/config`)

function addingExerciseGroupToDatabase (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateToken(request.headers.authorization)
      const validationBody = await Joi.validate(request.body, schema.exercise_group_add.requestBody)

      const creation = await exerciseGroupAdd({
        name: request.body.name,
        description: request.body.description,
        exercises: [],
        relation_id: validationToken.relation_id
      })

      resolve(response
        .status(200)
        .send({
          message: creation.message,
          exercisegroup: creation.exercisegroup
        })
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

module.exports = addingExerciseGroupToDatabase
