const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)

const customerAdd = require(`../../lib/customer/customerAdd`)
const Customer = require(`../../models/Customer`)

const schema = require(`../validation/requestSchemaValidation`)

function customerValidateAndCreate (request, response, config) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.customer_add.requestHeader)
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
            Joi.validate(request.body, schema.customer_add.requestBody)
              .then(() => {
                customerAdd(verification.relation_id, request.body)
                  .then(info => {
                    response
                      .status(info.status)
                      .send({
                        message: info.message,
                        customer: info.customer
                      })
                  })
                  .catch(error => {
                    response
                      .status(info.status)
                      .send({
                        message: info.error,
                      })
                  })
              })
          }
        })
      })
      .catch((error) => {
        console.log(error)

        reject(response
          .status(401)
          .send({
            message: `Authentication failed - no/wrong authentication token`
          }))
      })
  })
}

module.exports = customerValidateAndCreate
