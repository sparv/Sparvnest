const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const exerciseGroupGetAll = require(`../../lib/exercisegroup/exerciseGroupGetAll`)
const exerciseGetAll = require(`../../lib/exercise/exerciseGetAll`)

const exerciseGroupAllGet = async (request, response) => {
  try {
    const validationToken = await validateAccessToken(request.headers.authorization)
    const gathering = await exerciseGroupGetAll(validationToken.user_id)

    const groupList = await Promise.all(gathering.exercisegroup_list.map(async item => {
      const exerciseList = await exerciseGetAll(item.exercisegroup_id)
      item[`exercise_count`] = exerciseList.exercise_list.length

      return item
    }))

    return response
      .status(200)
      .send({
        exercise_groups_list: groupList
      })
  } catch (error) {
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = exerciseGroupAllGet
