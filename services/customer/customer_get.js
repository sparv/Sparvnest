const Joi = require(`joi`)

const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const customerGet = require(`../../lib/customer/customerGet`)

const config = require(`../../server/config`)


function getCustomerList (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateAccessToken(request.headers.authorization)
      const validationParams = await Joi.validate({ customer_id: request.params.customerId }, schema.customer_get.requestParams)

      const gathering = await customerGet(validationToken.user_id, request.params.customerId)

      resolve(response
        .status(200)
        .send({
          message: gathering.message,
          customer: gathering.customer
        })
      )
    } catch (error) {
      const mapping = errorMap(error)
      console.log(error)

      reject(response
        .status(mapping.status)
        .send(mapping)
      )
    }
  })
}

module.exports = getCustomerList
