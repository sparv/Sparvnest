const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const customerGet = require(`../../lib/customer/customerGet`)
const customerUpdate = require(`../../lib/customer/customerUpdate`)

const config = require(`../../server/config`)

function updateCustomerInDatabase (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateAccessToken(request.headers.authorization)
      const validationParams = await Joi.validate({ customer_id: request.params.customerId }, schema.customer_update.requestParams)
      const validationBody = await Joi.validate(request.body, schema.customer_update.requestBody)

      const update = await customerUpdate(request.params.customerId, request.body)

      resolve(response
        .status(200)
        .send({
          message: update.message
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

module.exports = updateCustomerInDatabase
