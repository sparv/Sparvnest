const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const customerGet = require(`../../lib/customer/customerGet`)
const customerUpdate = require(`../../lib/customer/customerUpdate`)

const config = require(`../../server/config`)

function updateCustomerInDatabase (request, response) {
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

            Joi.validate({customer_id: customerId}, schema.customer_update.requestParams)
              .then(() => {
                Joi.validate(request.body, schema.customer_update.requestBody)
                .then(() => {
                  const data = request.body
                  let updateData = {}

                  if (data.forename !== null) updateData[`forename`] = data.forename
                  if (data.surname !== null) updateData[`surname`] = data.surname
                  if (data.email !== null) updateData[`email`] = data.email
                  if (data.phone !== null) updateData[`phone`] = data.phone
                  if (data.gender !== null) updateData[`gender`] = data.gender
                  if (data.age !== null) updateData[`age`] = data.age
                  if (data.notes !== null) updateData[`notes`] = data.notes

                  customerUpdate(customerId, updateData)
                    .then(info => {
                      resolve(response
                        .status(info.status)
                        .send({ message: info.message }))
                    })
                    .catch(info => {
                      reject(response
                        .status(info.status)
                        .send({ message: info.message }))
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
  })
}

module.exports = updateCustomerInDatabase
