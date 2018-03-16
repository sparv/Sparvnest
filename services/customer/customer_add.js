const Joi = require(`joi`)

const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const customerAdd = require(`../../lib/customer/customerAdd`)

const config = require(`../../server/config`)

function customerValidateAndCreate (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateAccessToken(request.headers.authorization)
      const validationBody = await Joi.validate(request.body, schema.customer_add.requestBody)

      const creation = await customerAdd(validationToken.user_id, request.body)

      resolve(response
        .status(200)
        .send({
          message: creation.message,
          customer: creation.customer
        })
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

module.exports = customerValidateAndCreate
