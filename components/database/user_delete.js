const jwt = require(`jsonwebtoken`)
const hashPassword = require(`./hash_password`)

function userDelete (request, response, tableUsers, config) {
  let token = ``

  if (request.headers.authorization !== undefined) {
    token = request.headers.authorization.replace(`Bearer `, ``)
  }

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

      tableUsers.findOne({ where: { email: verification.name } })
      .then((user) => {
        const hashedPassword = hashPassword(request.body.password, user.salt)

        if (hashedPassword === user.password) {
          tableUsers.destroy({ where: { email: verification.name } })
          .then(() => {
            return response.send({
              message: `User deleted`
            })
          })
          .catch((err) => {
            console.log(err)
            return response
              .status(400)
              .send({
                message: `The request cannot be computed - client sent invalid data to server endpoint`
              })
          })
        } else {
          return response
            .status(401)
            .send({
              message: `User authentication failed`
            })
        }
      })
      .catch((err) => {
        console.log(err)
        return response
          .status(500)
          .send({
            message: `Internal Server Error`
          })
      })
    })
  } else {
    return response
      .status(401)
      .send({
        message: `Authentication failed - no/wrong authentication token`
      })
  }
}

module.exports = userDelete
