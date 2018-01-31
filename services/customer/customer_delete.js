const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const customerDelete = require(`../../lib/customer/customerDelete`)

const config = require(`../../server/config`)

function deleteCustomerFromDatabase (request, response, Customer) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.customer_delete.requestHeader)
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

            Joi.validate({customer_id: customerId}, schema.customer_delete.requestParams)
              .then(() => {
                Joi.validate(request.body, schema.customer_delete.requestBody)
                .then(() => {
                  customerDelete(verification.relation_id, request.params.customerId, request.body.surname)
                    .then(info => {
                      response
                        .status(info.status)
                        .send({
                          message: info.message
                        })
                    })
                    .catch(info => {
                      response
                        .status(info.status)
                        .send({
                          message: info.message
                        })
                    })
                })
                .catch(error => {
                  console.log(error)

                  reject(response
                    .status(400)
                    .send({
                      message: `[${error.name}] ${error.details[0].message}`
                    }))
                })
              })
              .catch((error) => {
                console.log(error)

                reject(response
                  .status(500)
                  .send({
                    message: `Customer not deleted`
                  }))
              })
          }
        })
      })
      .catch(error => console.error(error))
  })
}

module.exports = deleteCustomerFromDatabase
