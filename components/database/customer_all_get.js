const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function customerAllGet (request, response, tableCustomers, config) {
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

            reject(response
              .status(401)
              .send({
                message: `JWT authentication failed`
              }))
          }

          tableCustomers.findAll({ where: { relation_id: verification.relation_id } })
            .then((users) => {
              const customerList = users.map((user) => {
                return {
                  customer_id: user.customer_id,
                  forename: user.forename,
                  surname: user.surname,
                  phone: user.phone,
                  email: user.email
                }
              })

              resolve(response
                .status(200)
                .send({
                  customer_list: customerList
                }))
            })
            .catch((err) => {
              if (err) console.log(err)

              reject(response
                .status(500)
                .send({
                  message: `Internal server error`
                }))
            })
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

module.exports = customerAllGet
