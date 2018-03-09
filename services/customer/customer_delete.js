const Joi = require(`joi`)

const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const customerDelete = require(`../../lib/customer/customerDelete`)

const config = require(`../../server/config`)

function deleteCustomerFromDatabase (request, response, Customer) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateToken(request.headers.authorization)
      const validationParams = await Joi.validate({ customer_id: request.params.customerId }, schema.customer_delete.requestParams)
      const validationBody = await Joi.validate(request.body, schema.customer_delete.requestBody)

      const deletion = await customerDelete(validationToken.relation_id, request.params.customerId, request.body.surname)

      resolve(response
        .status(200)
        .send({ message: deletion.message })
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

module.exports = deleteCustomerFromDatabase
