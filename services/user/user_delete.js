const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)

const schema = require(`../validation/requestSchemaValidation`)

const hashPassword = require(`../../lib/helper/hash_password`)
const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const userGet = require(`../../lib/user/userGet`)
const userDelete = require(`../../lib/user/userDelete`)

const config = require(`../../server/config`)

function deleteUserFromDatabase (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateAccessToken(request.headers.authorization)
      const validationBody = await Joi.validate(request.body, schema.user_delete.requestBody)

      const information = await userGet(validationToken.email)
      const hashedPassword = hashPassword(request.body.password, information.user.salt)

      if (hashedPassword !== information.user.password) {
        throw Error(`User credentials are not valid`)
      }

      const deletion = await userDelete(validationToken.relation_id)

      resolve(response
        .status(200)
        .send({ message: `User deleted` })
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

module.exports = deleteUserFromDatabase
