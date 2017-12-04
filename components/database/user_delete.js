const jwt = require(`jsonwebtoken`)
const hashPassword = require(`./hash_password`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function userDelete (request, response, tableUsers, config) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.user_delete.requestHeader)
      .then(() => {
        const strippedToken = auth.token.replace(`Bearer `, ``)

        jwt.verify(strippedToken, config.auth.secret, (err, verification) => {
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
          }

          Joi.validate(request.body, schema.user_delete.requestBody)
            .then(() => {
              tableUsers.findOne({ where: { email: verification.name } })
                .then((user) => {
                  const hashedPassword = hashPassword(request.body.password, user.salt)

                  if (hashedPassword === user.password) {
                    tableUsers.destroy({ where: { email: verification.name } })
                    .then(() => {
                      resolve(response
                        .status(200)
                        .send({
                          message: `User deleted`
                        }))
                    })
                    .catch((err) => {
                      console.log(err)
                      reject(response
                        .status(400)
                        .send({
                          message: `The request cannot be computed - client sent invalid data to server endpoint`
                        }))
                    })
                  } else {
                    reject(response
                      .status(401)
                      .send({
                        message: `User authentication failed`
                      }))
                  }
                })
                .catch((err) => {
                  console.log(err)
                  reject(response
                    .status(500)
                    .send({
                      message: `Internal Server Error`
                    }))
                })
            })
            .catch((error) => {
              rejecct(response
                .status(400)
                .send({
                  message: `[${error.name}] ${error.details[0].message}`
                }))
            })
        })
      })
      .catch((error) => {
        reject(response
          .status(401)
          .send({
            message: `[${error.name}] ${error.details[0].message}`
          }))
      })
  })
}

module.exports = userDelete
