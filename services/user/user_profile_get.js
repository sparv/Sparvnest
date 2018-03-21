const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)
const userGet = require(`../../lib/user/userGet`)

const config = require(`../../server/config`)

const getUserProfile = async (request, response, config) => {
  try {
    const validation = await validateAccessToken(request.headers.authorization)
    const information = await userGet(validation.email)

    delete information.user[`password`]
    delete information.user[`salt`]

    return response
      .status(200)
      .send(information.user)
  } catch (error) {
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = getUserProfile 
