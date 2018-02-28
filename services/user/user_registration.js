const Joi = require(`joi`)

const schema = require(`../validation/requestSchemaValidation`)

const errorMap = require(`../../lib/helper/errorMap`)

const userAdd = require(`../../lib/user/userAdd`)

function userRegistration (response, data) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationBody = await Joi.validate(data, schema.user_registration.requestBody)

      const registration = await userAdd(data)

      console.log(registration)

      resolve(response
        .status(200)
        .send(registration)
      )
    } catch (error) {
      const mapping = errorMap(error)

      reject(response
        .status(mapping.status)
        .send(mapping)
      )
    }
  })
}

module.exports = userRegistration
