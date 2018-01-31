const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const customerGetAll = require(`../../lib/customer/customerGetAll`)

const config = require(`../../server/config`)

function getCompleteCustomerList (request, response) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.customer_all_get.requestHeader)
      .then(() => {
        const strippedToken = auth.token.replace(`Bearer `, ``)

        jwt.verify(strippedToken, config.auth.secret, (error, verification) => {
          if (error) {
            console.log(error)

            if (error.name === `TokenExpiredError`) {
              reject(response
                .status(510)
                .send({
                  message: `JWT token expired`
                }))
            } else {
              reject(response
                .status(401)
                .send({
                  message: `JWT authentication failed`
                }))
            }
          } else {
            customerGetAll(verification.relation_id)
              .then(info => {
                response
                  .status(info.status)
                  .send({ customer_list: info.customer_list })
              })
              .catch(info => {
                response
                  .status(info.status)
                  .send({ message: info.message })
              })
          }
        })
      })
      .catch((error) => {
        reject(response
          .status(401)
          .send({
            message: `[${error.name}] ${error}`
          }))
      })
  })
}

module.exports = getCompleteCustomerList
