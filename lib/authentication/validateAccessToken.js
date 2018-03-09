const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)

const config = require(`../../server/config`)

// Object schema definition to which the jwt bearer token will be validated to
const schema = Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()

const validateToken = (authHeader) => {
  return new Promise(async (resolve, reject) => {
    try {
      const validation = await Joi.validate(authHeader, schema)
      const token = authHeader.replace(`Bearer `, ``)
      const decoded = await jwt.verify(token, config.auth.access_token.secret)

      resolve(decoded)
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = validateToken
