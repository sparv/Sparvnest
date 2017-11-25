const hashPassword = require(`./hash_password`)
const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function userUpdate (request, response, tableUsers, config) {
  let auth = {
    token: request.headers.authorization
  }

  Joi.validate(auth, schema.user_update.requestHeader)
    .then(() => {
      const strippedToken = auth.token.replace(`Bearer `, ``)

      jwt.verify(strippedToken, config.auth.secret, (err, verification) => {
        if (err) {
          console.log(err)

          return response
            .status(401)
            .send({
             message: `[ERROR] JWT token invalid`
            })
        }

        if (request.body.meta === undefined && request.body.security === undefined) {
          return response
            .status(400)
            .send({
              message: `The data sent is invalid - no meta or security object found`
            })
        } else if (request.body.meta !== undefined && request.body.security !== undefined) {
          return response
            .status(400)
            .send({
              message: `The data sent is invalid - only one object is possible, meta or security`
            })
        } else if (request.body.meta !== undefined && request.body.security === undefined) {
          const data = request.body.meta

          Joi.validate(data, schema.user_update.requestBody.meta)
            .then(() => {
              let updateData = {}

              if (data.forename !== null) updateData[`forename`] = data.forename
              if (data.surname !== null) updateData[`surname`] = data.surname
              if (data.email !== null) updateData[`email`] = data.email

              tableUsers.findOne({ where: { email: updateData.email } })
                .then(user => {
                  if (user !== null) {
                    return response
                      .status(400)
                      .send({
                        message: `This email adress is already asociated with an user account`
                      })
                  }

                  tableUsers.update(updateData, { where: { relation_id: verification.relation_id } })
                    .then((affectedRows) => {
                      tableUsers.findOne({ where: { relation_id: verification.relation_id }})
                      .then(user => {
                        if (user === null) {
                          return response
                            .status(400)
                            .send({
                              message: `updated user could not be found`
                            })
                        }

                        const token = jwt.sign({
                          sub: `user_authentication`,
                          name: user.email,
                          relation_id: user.relation_id
                        }, config.auth.secret)

                        return response
                          .status(200)
                          .send({
                            message: `User data was updated`,
                            token: token
                          })
                      })
                    })
                    .catch(() => {
                      return response
                        .status(500)
                        .send({
                          message: `Database Error - User was not updated`
                        })
                    })
                })
                .catch(() => {
                  return response
                    .status(500)
                    .send({
                      message: `Database Error - User was not updated`
                    })
                })
            })
            .catch((error) => {
              return response
                .status(400)
                .send({
                  message: `[${error.name}] ${error.details[0].message}`
                })
            })
        } else if (request.body.meta === undefined && request.body.security !== undefined) {
          const data = request.body.security

          Joi.validate(data, schema.user_update.requestBody.security)
            .then(() => {
              tableUsers.findOne({ where: { relation_id: verification.relation_id } })
                .then(user => {
                  const password = {
                    old: hashPassword(data.password_old, user.salt),
                    new: hashPassword(data.password_new, user.salt)
                  }

                  if (user.password === password.old) {
                    tableUsers.update({ password: password.new }, {
                      where: { email: user.email }
                    })
                      .then(() => {
                        const token = jwt.sign({
                          sub: `user_autentication`,
                          name: user.email,
                          relation_id: user.relation_id
                        }, config.auth.secret)

                        return response
                          .status(200)
                          .send({
                            message: `User password was updated`,
                            token: token
                          })
                      })
                  } else {
                    return response
                      .status(401)
                      .send({
                        message: `Authentication failed - current password is associated with this user`
                      })
                  }
                })
                .catch(() => {
                  return response
                    .status(500)
                    .send({
                      message: `Database Error: User not found`
                    })
                })
            })
            .catch((error) => {
              return response
                .status(400)
                .send({
                  message: `[${error.name}] ${error.details[0].message}`
                })
            })
        }
      })
    })
    .catch((error) => {
      console.log(error)

      return response
        .status(401)
        .send({
          message: `Authentication failed - no/wrong authentication token`
        })
    })
}

module.exports = userUpdate
