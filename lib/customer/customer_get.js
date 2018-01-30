const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

const Customer = require(`../../models/Customer`)

function customerGet (request, response, Customer, config) {
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
                Customer.findOne({ where: {
                  customer_id: customerId,
                  relation_id: verification.relation_id
                } })
                  .then((customer) => {
                    if (customer !== null) {
                      resolve(response
                        .status(200)
                        .send({
                          customer_id: customer.customer_id,
                          forename: customer.forename,
                          surname: customer.surname,
                          phone: customer.phone,
                          email: customer.email,
                          gender: customer.gender,
                          age: customer.age,
                          notes: customer.notes,
                          dates: [],
                          trainingplans: []
                        }))
                    } else {
                      reject(response
                        .status(404)
                        .send({
                          message: `User with this ID not found`
                        }))
                    }
                  })
                  .catch((error) => {
                    console.log(error)
                    reject(response
                      .status(500)
                      .send({
                        message: `Internal DB error`
                      }))
                  })
              })
              .catch((error) => {
                console.log(error)
                reject(response
                  .status(401)
                  .send({
                    message: `[${error.name}] ${error.details[0].message}`
                  }))
              })
          }
        })
      })
      .catch((error) => {
        console.log(error)
        reject(response
          .status(401)
          .send({
            message: `[${error.name}] ${error.details[0].message}`
          }))
      })
  })
}

module.exports = customerGet
