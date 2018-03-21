const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const exerciseGroupGetAll = require(`../../lib/exercisegroup/exerciseGroupGetAll`)

const exerciseGroupAllGet = async (request, response) => {
  try {
    const validationToken = await validateAccessToken(request.headers.authorization)
    const gathering = await exerciseGroupGetAll(validationToken.user_id)

    return response
      .status(200)
      .send({
        exercise_groups_list: gathering.exercisegroup_list
      })
  } catch (error) {
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = exerciseGroupAllGet
