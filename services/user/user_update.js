const Joi = require(`joi`)
const jwt = require(`jsonwebtoken`)

const schema = require(`../validation/requestSchemaValidation`)

const hashPassword = require(`../../lib/helper/hash_password`)
const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)
const generateAccessToken = require(`../../lib/authentication/generateAccessToken`)

const userGet = require(`../../lib/user/userGet`)
const userUpdate = require(`../../lib/user/userUpdate`)

const config = require(`../../server/config`)

const updatingUserData = async (request, response) => {
  try {
    const validation = await validateAccessToken(request.headers.authorization)

    //TODO request body validation should be done by Joi
    if (request.body.meta === undefined && request.body.security === undefined) throw Error(`no valid property found`)
    if (request.body.meta !== undefined && request.body.security !== undefined) throw Error(`The data sent is invalid - only one object is possible, meta or security`)

    if (request.body.meta !== undefined && request.body.security === undefined) {
      const data = request.body.meta
      const validationBody = await Joi.validate(data, schema.user_update.requestBody.meta)
      const update = await userUpdate(validation.user_id, data)
      const information = await userGet(validation.email)

      const token = generateAccessToken(information.user.user_id)

      return response
        .status(200)
        .send({
          message: `User data was updated`,
          token: token
        })
    }

    if (request.body.meta === undefined && request.body.security !== undefined) {
      const data = request.body.security
      const validationBody = await Joi.validate(data, schema.user_update.requestBody.security)
      const information = await userGet(validation.email)

      const password = {
        old: hashPassword(data.password_old, information.user.salt),
        new: hashPassword(data.password_new, information.user.salt)
      }

      if (information.user.password !== password.old) {
        const error = new Error
        error.name = `UserCredentialsError`
        error.message = `Current user password not valid`
        throw error
      }

      const update = await userUpdate(validation.user_id, { password: password.new })
      const token = generateAccessToken(information.user)

      return response
        .status(200)
        .send({
          message: `User data was updated`,
          token: token
        })
    }
  } catch (error) {
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = updatingUserData
