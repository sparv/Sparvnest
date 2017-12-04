const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function customerDelete (request, response, tableCustomers, config) {
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
          }

          const customerId = request.params.customerId

          Joi.validate({customer_id: customerId}, schema.customer_delete.requestParams)
            .then(() => {
              Joi.validate(request.body, schema.customer_delete.requestBody)
              .then(() => {
                tableCustomers.destroy({ where: {
                  customer_id: request.params.customerId,
                  relation_id: verification.relation_id,
                  surname: request.body.surname
                } })
                  .then((affectedRows) => {
                    if (affectedRows === 0) {
                      reject(response
                        .status(400)
                        .send({
                          message: `No Customer deleted`
                        }))
                    } else {
                      resolve(response
                        .status(200)
                        .send({
                          message: `Customer deleted`
                        }))
                    }
                  })
              })
              .catch((error) => {
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
        })
      })
  })
}

module.exports = customerDelete
