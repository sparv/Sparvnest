const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const exerciseGroupGetAll = require(`../../lib/exercisegroup/exerciseGroupGetAll`)

const config = require(`../../server/config`)

function exerciseGroupAllGet (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateAccessToken(request.headers.authorization)
      const gathering = await exerciseGroupGetAll(validationToken.relation_id)

      resolve(response
        .status(200)
        .send({
          exercise_groups_list: gathering.exercisegroup_list
        }))
    } catch (error) {
      const mapping = errorMap(error)

      reject(response
        .status(mapping.status)
        .send(mapping)
      )
    }
  })
}

module.exports = exerciseGroupAllGet
