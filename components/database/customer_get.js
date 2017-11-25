const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function customerGet (request, response, tableCustomers, config) {
  let auth = {
    token: request.headers.authorization
  }

  Joi.validate(auth, schema.customer_get.requestHeader)
    .then(() => {
      jwt.verify(token, config.auth.secret, (err, verification) => {
        if (err) {
          console.log(err)
          return response
            .status(401)
            .send({
              message: `JWT authentication failed`
            })
        }

        const customerId = request.params.customerId

        Joi.validate({customer_id: customerId}, schema.customer_get.requestParams)
          .then(() => {
            tableCustomers.findOne({ where: {
              customer_id: customerId,
              relation_id: verification.relation_id
            } })
              .then((customer) => {
                console.log(customer)
                if (customer !== null) {
                  return response
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
                    })
                } else {
                  return response
                    .status(404)
                    .send({
                      message: `User with this ID not found`
                    })
                }
              })
              .catch((error) => {
                console.log(error)
                return response
                  .status(500)
                  .send({
                    message: `Internal DB error`
                  })
              })
          })
          .catch((error) => {
            console.log(error)
            return response
              .status(401)
              .send({
                message: `[${error.name}] ${error.details[0].message}`
              })
          })
      })
    })
    .catch((error) => {
      console.log(error)
      return response
        .status(401)
        .send({
          message: `[${error.name}] ${error.details[0].message}`
        })
    })
}

module.exports = customerGet
