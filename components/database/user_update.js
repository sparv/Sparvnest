const hashPassword = require(`./hash_password`)
const jwt = require(`jsonwebtoken`)

function userUpdate (request, response, tableUsers, config) {
  let token = ``

  if (request.headers.authorization !== undefined) {
    token = request.headers.authorization.replace(`Bearer `, ``)
  }

  if ((token !== `undefined`) && (token !== ``)) {
    jwt.verify(token, config.auth.secret, (err, verification) => {
      if (err) {
        console.log(`JWT authentication failed`)
        return response
          .status(401)
          .send({
            message: `User authentication failed`
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

            console.log(verification)

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
      } else if (request.body.meta === undefined && request.body.security !== undefined) {
        const data = request.body.security

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
      }
    })
  } else {
    return response
      .status(401)
      .send({
        message: `Authentication failed - no/wrong authentication token`
      })
  }
}

module.exports = userUpdate
