const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)

const hashPassword = require(`../../lib/helper/hash_password`)
const schema = require(`../validation/requestSchemaValidation`)

const userGet = require(`../../lib/user/userGet`)
const userDelete = require(`../../lib/user/userDelete`)

const config = require(`../../server/config`)

function deleteUserFromDatabase (request, response) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.user_delete.requestHeader)
      .then(() => {
        const strippedToken = auth.token.replace(`Bearer `, ``)

        jwt.verify(strippedToken, config.auth.secret, (error, verification) => {
          if (error) {
            console.log(error)

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
          } else {
            Joi.validate(request.body, schema.user_delete.requestBody)
              .then(() => {
                userGet(verification.relation_id)
                  .then(info => {
                    const hashedPassword = hashPassword(request.body.password, info.user.salt)
                    if (hashedPassword === info.user.password) {
                      userDelete(verification.relation_id)
                        .then(info => {
                          resolve(response
                            .status(info.status)
                            .send({ message: info.message })
                          )
                        })
                        .catch(info => {
                          reject(response
                            .status(info.status)
                            .send({ message: info.message })
                          )
                        })
                    }
                  })
                  .catch(info => {
                    console.log(info)
                    reject(response
                      .status(info.status)
                      .send({ message: info.message })
                    )
                  })
              })
              .catch(error => {
                console.error(error)
                reject(response
                  .status(400)
                  .send({
                    message: `[${error.name}] ${error.details[0].message}`
                  }))
              })
          }
        })
      })
      .catch(error => {
        console.error(error)
        reject(response
          .status(401)
          .send({
            message: error
          }))
      })
  })
}

module.exports = deleteUserFromDatabase
