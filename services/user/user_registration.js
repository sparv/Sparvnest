const Joi = require(`joi`)

const schema = require(`../validation/requestSchemaValidation`)

const userAdd = require(`../../lib/user/userAdd`)

function userRegistration (response, data) {
  return new Promise((resolve, reject) => {
    Joi.validate(data, schema.user_registration.requestBody)
      .then(() => {
        userAdd(data)
          .then(info => {
            resolve(response
              .status(info.status)
              .send(info.user)
            )
          })
          .catch(info => {
            reject(response
              .status(info.status)
              .send(info.message)
            )
          })
      })
      .catch((error) => {
        console.log(error)
        reject(response
          .status(403)
          .send({
            message: `[ERROR] Request Body Object contains invalid data`
          }))
      })
  })
}

module.exports = userRegistration
