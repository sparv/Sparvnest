const jwt = require(`jsonwebtoken`)

function customerAdd (request, response, tableCustomers, config) {
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
        email: request.body.email,
        relation_id: verification.relation_id
      } })
        .then((customer) => {
          if (customer) {
            return response
              .status(400)
              .send({
                message: `customer already added`
              })
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
              return response
                .status(200)
                .send({
                  message: `Customer added`
                })
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
      .status(400)
      .send({
        message: `Invalid data - cannot computed`
      })
  }
}

module.exports = customerAdd
