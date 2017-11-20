const jwt = require(`jsonwebtoken`)

function customerGet (request, response, tableCustomers, config) {
  let token = ``

  if (request.headers.authorization !== undefined) {
    token = request.headers.authorization.replace(`Bearer `, ``)
  }

  if ((token !== `undefined`) && (token !== ``)) {
    jwt.verify(token, config.auth.secret, (err, verification) => {
      if (err) {
        console.log(err)
        return response
          .status(401)
          .send({
            message: `JWT authentication failed`
          })
      }

      tableCustomers.findOne({ where: {
        customer_id: request.params.customerId,
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
        .catch((err) => {
          if (err) console.log(err)
          return response
            .status(500)
            .send({
              message: `Internal server error`
            })
        })
    })
  } else {
    return response
      .status(401)
      .send({
        message: `Authentication failed - no/wrong authentication token`
      })
  }
}

module.exports = customerGet
