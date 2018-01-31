const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const customerGet = require(`../../lib/customer/customerGet`)

const config = require(`../../server/config`)


function getCustomerList (request, response) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.customer_get.requestHeader)
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
            const customerId = request.params.customerId

            Joi.validate({customer_id: customerId}, schema.customer_get.requestParams)
              .then(() => {
                customerGet(verification.relation_id, customerId)
                  .then(info => {
                    response
                      .status(200)
                      .send(info.customer)
                  })
                  .catch(error => {
                    console.error(error)
                    response
                      .status(404)
                      .send({
                        message: `User with this ID not found`
                      })
                  })
              })
              .catch(error => {
                console.error(error)
                reject(response
                  .status(401)
                  .send({
                    message: `[${error.name}] ${error.details[0].message}`
                  }))
              })
          }
        })
      })
      .catch(error => {
        console.error(error)
        reject(response
          .status(401)
          .send({
            message: `[${error.name}] ${error.details[0].message}`
          }))
      })
  })
}

module.exports = getCustomerList
