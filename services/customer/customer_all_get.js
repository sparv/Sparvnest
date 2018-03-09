const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)

const schema = require(`../validation/requestSchemaValidation`)

const validateAccessToken = require(`../../lib/authentication/validateAccessToken`)
const errorMap = require(`../../lib/helper/errorMap`)

const customerGetAll = require(`../../lib/customer/customerGetAll`)

const config = require(`../../server/config`)

function getCompleteCustomerList (request, response) {
  return new Promise(async (resolve, reject) => {
    try {
      const validationToken = await validateAccessToken(request.headers.authorization)

      const gathering = await customerGetAll(validationToken.relation_id)

      resolve(response
        .status(gathering.status)
        .send({
          message: gathering.message,
          customer_list: gathering.customer_list
        })
      )

    } catch (error) {
      console.log(error)
      const mapping = errorMap(error)

      reject(response
        .status(mapping.status)
        .send(mapping)
      )
    }
  })
}

module.exports = getCompleteCustomerList
