const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

function tokenRefresh (request, response, config) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.token_refresh.requestHeader)
      .then(() => {
        const strippedToken = auth.token.replace(`Bearer `, ``)
        jwt.verify(strippedToken, config.auth.secret, (error, oldJwtPayload) => {
          if (error) {
            console.log(error)
            reject(response
              .status(510)
              .send({
                message: error.message
              }))
          } else {
            const newJwtPayload = {
              sub: oldJwtPayload.sub,
              name: oldJwtPayload.name,
              relation_id: oldJwtPayload.relation_id
            }

            jwt.sign(newJwtPayload, config.auth.secret, { expiresIn: config.auth.tokenExpirationTime }, (error, token) => {
              if (error) {
                reject(response
                  .status(500)
                  .send({
                    message: `[${error.name}] ${error.details[0].message}`
                  }))
              }

              resolve(response
                .status(201)
                .send({
                  token: token
                }))
            })
          }
        })
      })
      .catch(error => {
        console.log(error)
        reject(response
          .status(500)
          .send({
            message: `[ERROR] Validation failed`
          }))
      })
  })
}

module.exports = tokenRefresh
