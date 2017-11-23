const jwt = require(`jsonwebtoken`)
const hashPassword = require(`./hash_password`)
const createSalt = require(`./create_salt`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function userRegistration (response, dbTable, data, config) {
  Joi.validate(data, schema.user_registration.requestBody)
    .then(() => {
      console.log(`[STATUS] Request body object is valid`)
      dbTable.findOne({ where: { email: data.email } })
        .then((user) => {
          if (user) {
            return response
              .status(403)
              .send({
                message: `User not registered - there is already a user registered with this email adress`
              })
          } else {
            const salt = createSalt()
            dbTable.create({
              email: data.email,
              password: hashPassword(data.password, salt),
              salt: salt,
              forename: data.forename,
              surname: data.surname
            }).then((user) => {
              const jwtPayload = {
                sub: `user_authentication`,
                name: user.email,
                relation_id: user.relation_id
              }

              const token = jwt.sign(jwtPayload, config.auth.secret)

              return response
                .status(200)
                .send({
                  relation_id: user.relation_id,
                  forename: user.forename,
                  surname: user.surname,
                  email: user.email,
                  token: token
                })
            })
          }
        })
        .catch((err) => {
          console.log(err)
          return response
            .status(500)
            .send({
              message: `An error happened on the server side`
            })
        })
    })
    .catch((error) => {
      console.log(`[ERROR] Request Body Object contains invalid data`)
      console.log(error)

      return response
        .status(500)
        .send({
          message: `[ERROR] Request Body Object contains invalid data`
        })
    })
}

module.exports = userRegistration
