// TODO authentication and full api specs implementation needed!!!
//
const hashPassword = require(`./hash_password`)
const jwt = require(`jsonwebtoken`)

function userUpdate (request, response, tableUsers, config) {
  if ((token !== `undefined`) && (token !== ``)) {
    jwt.verify(token, config.auth.secret, (err, verification) => {
      if (err) {
        console.log(err)
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

        tableUsers.update(updateData, { where: { email: verification.email } })
          .then(user => {
            console.log(`updated user promise response`)

            const token = jwt.sign({
              sub: `user_autentication`,
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
          .catch(() => {
            return response
              .status(500)
              .send({
                message: `Database Error - User was not updated`
              })
          })
      } else if (request.body.meta === undefined && request.body.security !== undefined) {
        const data = request.body.security

        tableUsers.findOne({ where: { email: validation.email } })
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
  }
}

module.exports = userUpdate
