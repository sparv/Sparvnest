const jwt = require(`jsonwebtoken`)

function customerGet (request, response, tableCustomers, config) {
  const token = request.headers.authorization.replace(`Bearer `, ``)

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
      .status(400)
      .send({
        message: `Invalid data - cannot computed`
      })
  }
}

module.exports = customerGet
