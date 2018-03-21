const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)

const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const customerGetAll = require(`../../lib/customer/customerGetAll`)

const config = require(`../../server/config`)

const getCompleteCustomerList = async (request, response) => {
  try {
    const validationToken = await validateAccessToken(request.headers.authorization)

    const gathering = await customerGetAll(validationToken.user_id)

    return response
      .status(gathering.status)
      .send({
        message: gathering.message,
        customer_list: gathering.customer_list
      })
  } catch (error) {
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = getCompleteCustomerList
