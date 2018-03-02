const Joi = require(`joi`)
const jwt = require(`jsonwebtoken`)

const schema = require(`../validation/requestSchemaValidation`)

const hashPassword = require(`../../lib/helper/hash_password`)
const validateToken = require(`../../lib/helper/validateToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const userGet = require(`../../lib/user/userGet`)
const userUpdate = require(`../../lib/user/userUpdate`)

const config = require(`../../server/config`)

function updatingUserData (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validation = await validateToken(request.headers.authorization)

      //TODO request body validation should be done by Joi
      if (request.body.meta === undefined && request.body.security === undefined) throw Error(`no valid property found`)
      if (request.body.meta !== undefined && request.body.security !== undefined) throw Error(`The data sent is invalid - only one object is possible, meta or security`)

      if (request.body.meta !== undefined && request.body.security === undefined) {
        const data = request.body.meta
        const validationBody = await Joi.validate(data, schema.user_update.requestBody.meta)
        const update = await userUpdate(validation.relation_id, data)
        const information = await userGet(validation.relation_id)

        const token = jwt.sign({
          sub: `user_authentication`,
          name: information.user.email,
          relation_id: information.user.relation_id
        }, config.auth.secret)

        resolve(response
          .status(200)
          .send({
            message: `User data was updated`,
            token: token
          })
        )
      }

      if (request.body.meta === undefined && request.body.security !== undefined) {
        const data = request.body.security
        const validationBody = await Joi.validate(data, schema.user_update.requestBody.security)
        const information = await userGet(validation.relation_id)

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

        const update = await userUpdate(validation.relation_id, { password: password.new })

        const token = jwt.sign({
          sub: `user_autentication`,
          name: information.user.email,
          relation_id: information.user.relation_id
        }, config.auth.secret)

        resolve(response
          .status(200)
          .send({
            message: `User data was updated`,
            token: token
          })
        )
      }
    } catch (error) {
      const mapping = errorMap(error)

      reject(response
        .status(mapping.status)
        .send(mapping)
      )
    }
  })
}

module.exports = updatingUserData
