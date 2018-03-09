const validateToken = require(`../../lib/helper/validateToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const userGet = require(`../../lib/user/userGet`)

function userProfileGet (request, response, config) {
  return new Promise(async (resolve, reject) => {
    try {
      const validation = await validateToken(request.headers.authorization)
      const information = await userGet(validation.relation_id)

      delete information.user[`password`]
      delete information.user[`salt`]

      resolve(response
        .status(200)
        .send(information.user)
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

module.exports = userProfileGet
