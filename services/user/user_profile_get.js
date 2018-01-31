const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const userGet = require(`../../lib/user/userGet`)

function userProfileGet (request, response, config) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.user_profile_get.requestHeader)
      .then(() => {
        const strippedToken = auth.token.replace(`Bearer `, ``)

        jwt.verify(strippedToken, config.auth.secret, (error, verification) => {
          if (error) {
            console.error(error)

            if (error.name === `TokenExpiredError`) {
              reject(response
                .status(510)
                .send({
                  message: `JWT token expired`
                }))
            } else {
              reject(response
                .status(401)
                .send({
                  message: `JWT authentication failed`
                }))
            }
          }

          userGet(verification.relation_id)
            .then(info => {
              delete info.user[`password`]
              delete info.user[`salt`]

              resolve(response
                .status(info.status)
                .send(info.user)
              )
            })
            .catch(info => {
              reject(response
                .status(info.status)
                .send({ message: info.message })
              )
            })

        })
      })
      .catch(error => {
        console.error(error)

        reject(response
          .status(401)
          .send({
            message: `[ERROR] Authentication Token is invalid`
          }))
      })
  })
}

module.exports = userProfileGet
