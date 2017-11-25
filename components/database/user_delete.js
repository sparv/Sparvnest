const jwt = require(`jsonwebtoken`)
const hashPassword = require(`./hash_password`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function userDelete (request, response, tableUsers, config) {
  let auth = {
    token: request.headers.authorization
  }

  Joi.validate(auth, schema.user_delete.requestHeader)
    .then(() => {
      jwt.verify(token, config.auth.secret, (err, verification) => {
        if (err) {
          console.log(err)

          return response
            .status(401)
            .send({
              message: `[ERROR] JWT token invalid`
            })
        }

        Joi.validate(request.body, schema.user_delete.requestBody)
          .then(() => {
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
          .catch((error) => {
            return response
              .status(400)
              .send({
                message: `[${error.name}] ${error.details[0].message}`
              })
          })
      })
    })
    .catch((error) => {
      return response
        .status(401)
        .send({
          message: `[${error.name}] ${error.details[0].message}`
        })
    })
}

module.exports = userDelete
