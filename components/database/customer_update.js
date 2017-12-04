const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function customerUpdate (request, response, tableCustomers, config) {
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
          }

          const customerId = request.params.customerId

          Joi.validate({customer_id: customerId}, schema.customer_update.requestParams)
            .then(() => {
              Joi.validate(request.body, schema.customer_update.requestBody)
              .then(() => {
                tableCustomers.findOne({ where: {
                  customer_id: request.params.customerId,
                  relation_id: verification.relation_id
                } })
                  .then((customer) => {
                    const data = request.body
                    let updateData = {}

                    if (data.forename !== null) updateData[`forename`] = data.forename
                    if (data.surname !== null) updateData[`surname`] = data.surname
                    if (data.email !== null) updateData[`email`] = data.email
                    if (data.phone !== null) updateData[`phone`] = data.phone
                    if (data.gender !== null) updateData[`gender`] = data.gender
                    if (data.age !== null) updateData[`age`] = data.age
                    if (data.notes !== null) updateData[`notes`] = data.notes

                    tableCustomers.update(updateData, {
                      where: { id: customer.id } })
                      .then(() => {
                        resolve(response
                          .status(200)
                          .send({
                            message: `Customer updated`
                          }))
                      })
                  })
                  .catch((error) => {
                    console.log(error)

                    reject(response
                      .status(404)
                      .send({
                        message: `[Error] CustomerID not valid`
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
      })
  })
}

module.exports = customerUpdate
