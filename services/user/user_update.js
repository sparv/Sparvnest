const Joi = require(`joi`)
const jwt = require(`jsonwebtoken`)

const schema = require(`../validation/requestSchemaValidation`)

const userGet = require(`../../lib/user/userGet`)
const userUpdate = require(`../../lib/user/userUpdate`)
const hashPassword = require(`../../lib/helper/hash_password`)

const config = require(`../../server/config`)

function updatingUserData (request, response) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.user_update.requestHeader)
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
          }

          if (request.body.meta === undefined && request.body.security === undefined) {
            reject(response
              .status(400)
              .send({
                message: `The data sent is invalid - no meta or security object found`
              }))
          } else if (request.body.meta !== undefined && request.body.security !== undefined) {
            reject(response
              .status(400)
              .send({
                message: `The data sent is invalid - only one object is possible, meta or security`
              }))
          } else if (request.body.meta !== undefined && request.body.security === undefined) {
            const data = request.body.meta

            Joi.validate(data, schema.user_update.requestBody.meta)
              .then(() => {
                let updateData = {}

                if (data.forename !== null) updateData[`forename`] = data.forename
                if (data.surname !== null) updateData[`surname`] = data.surname
                if (data.email !== null) updateData[`email`] = data.email

                userUpdate(verification.relation_id, updateData)
                  .then(info => {
                    userGet(verification.relation_id)
                      .then(info => {
                        const token = jwt.sign({
                          sub: `user_authentication`,
                          name: info.user.email,
                          relation_id: info.user.relation_id
                        }, config.auth.secret)

                        response
                          .status(info.status)
                          .send({
                            message: info.message,
                            token: token
                          })
                      })
                  })
                  .catch(info => {
                    response
                      .status(info.status)
                      .send(info.message)
                  })
              })
              .catch((error) => {
                reject(response
                  .status(400)
                  .send({
                    message: `[${error.name}] ${error.details[0].message}`
                  }))
              })
          } else if (request.body.meta === undefined && request.body.security !== undefined) {
            const data = request.body.security

            Joi.validate(data, schema.user_update.requestBody.security)
              .then(() => {
                userGet(verification.relation_id)
                  .then(info => {
                    const password = {
                      old: hashPassword(data.password_old, info.user.salt),
                      new: hashPassword(data.password_new, info.user.salt)
                    }

                    if (info.user.password === password.old) {
                      userUpdate(verification.relation_id, { password: password.new })
                        .then(() => {
                          const token = jwt.sign({
                            sub: `user_autentication`,
                            name: info.user.email,
                            relation_id: info.user.relation_id
                          }, config.auth.secret)

                          resolve(response
                            .status(200)
                            .send({
                              message: `User password was updated`,
                              token: token
                            }))
                        })
                    } else {
                      reject(response
                        .status(401)
                        .send({
                          message: `Authentication failed - current password is associated with this user`
                        }))
                    }
                  })
                  .catch(error => {
                    console.error(error)

                    reject(response
                      .status(500)
                      .send({
                        message: `Database Error: User not found`
                      }))
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
            message: `Authentication failed - no/wrong authentication token`
          }))
      })
  })
}

module.exports = updatingUserData
