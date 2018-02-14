const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)

const config = require(`../../server/config`)

// Object schema definition to which the jwt bearer token will be validated to
const schema = Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()

const validateToken = (authHeader) => {
  return new Promise((resolve, reject) => {
    const validation = Joi.validate(authHeader, schema)

    if (validation.error !== null) reject(validation.error)

    const token = authHeader.replace(`Bearer `, ``)
    const decoded = jwt.verify(token, config.auth.secret)

    if (decoded.error !== undefined) reject(decoded.error)
    resolve(decoded)
  })
}

module.exports = validateToken
