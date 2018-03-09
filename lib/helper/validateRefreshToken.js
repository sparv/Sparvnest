const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)

const errorMap = require(`./errorMap`)

const config = require(`../../server/config`)

const schema = Joi.string().regex(/^[a-zA-Z0-9._-]+$/).required()

const validateRefreshToken = (cookie) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = cookie.replace(`refresh_token=`, ``)

      const validation = await Joi.validate(token, schema)
      const decoded = await jwt.verify(token, config.auth.refresh_token.secret)

      resolve(decoded)
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = validateRefreshToken
