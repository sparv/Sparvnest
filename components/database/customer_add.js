const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function customerAdd (request, response, tableCustomers, config) {
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

            reject(response
              .status(401)
              .send({
                message: `JWT authentication failed`
              }))
          }

          Joi.validate(request.body, schema.customer_add.requestBody)
            .then(() => {
              console.log(verification.relation_id)
              tableCustomers.findOne({ where: {
                email: request.body.email,
                relation_id: verification.relation_id
              } })
                .then((customer) => {
                  if (customer) {
                    reject(response
                      .status(400)
                      .send({
                        message: `customer already added`
                      }))
                  } else {
                    const data = request.body

                    tableCustomers.create({
                      relation_id: verification.relation_id,
                      forename: data.forename,
                      surname: data.surname,
                      email: data.email,
                      phone: data.phone,
                      gender: data.gender,
                      age: data.age,
                      notes: data.notes
                    }).then(customer => {
                      resolve(response
                        .status(200)
                        .send({
                          message: `Customer added`,
                          customer: {
                            id: customer.id,
                            forename: customer.forename,
                            surname: customer.surname,
                            email: customer.email,
                            phone: customer.phone,
                            gender: customer.gender,
                            age: customer.age
                          }
                        }))
                    })
                  }
                })
                .catch((error) => {
                  console.log(error)

                  reject(response
                    .status(500)
                    .send({
                      message: `Internal server error`
                    }))
                })
            })
            .catch((error) => {
              console.log(error)

              reject(response
                .status(500)
                .send({
                  message: `[${error.name}] ${error.details[0].message}`
                }))
            })
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

module.exports = customerAdd
