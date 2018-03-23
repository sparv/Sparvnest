const Joi = require(`joi`)

const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const customerDelete = require(`../../lib/customer/customerDelete`)

const config = require(`../../server/config`)

const deleteCustomerFromDatabase = async (request, response, Customer) => {
  try {
    const validationToken = await validateAccessToken(request.headers.authorization)
    const validationParams = await Joi.validate({ customer_id: request.params.customerId }, schema.customer_delete.requestParams)
    const validationBody = await Joi.validate(request.body, schema.customer_delete.requestBody)

    const deletion = await customerDelete(validationToken.user_id, request.params.customerId, request.body.surname)

    return response
      .status(200)
      .send({ message: deletion.message })
  } catch (error) {
    console.log(error)
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = deleteCustomerFromDatabase
