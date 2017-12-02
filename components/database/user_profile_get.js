const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function userProfileGet (request, response, tableUsers, config) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    console.log(auth.token)

    Joi.validate(auth, schema.user_profile_get.requestHeader)
      .then(() => {
        const strippedToken = auth.token.replace(`Bearer `, ``)

        jwt.verify(strippedToken, config.auth.secret, (err, verification) => {
          if (err) {
            console.log(err)
            reject(response
              .status(401)
              .send({
                message: `JWT authentication failed`
              }))
          }

          tableUsers.findOne({ where: { relation_id: verification.relation_id } })
            .then((user) => {
              resolve(response
                .status(200)
                .send({
                  email: user.email,
                  forename: user.forename,
                  surname: user.surname
                }))
            })
            .catch((error) => {
              console.log(error)

              reject(response
                .status(500)
                .send({
                  message: `[ERROR] Internal server error`
                }))
            })
        })
      })
      .catch((error) => {
        console.log(`[ERROR] Authentication Token is invalid`)
        console.log(error)

        reject(response
          .status(401)
          .send({
            message: `[ERROR] Authentication Token is invalid`
          }))
      })
  })
}

module.exports = userProfileGet
