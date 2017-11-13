const jwt = require(`jsonwebtoken`)

function customerAllGet (request, response, tableCustomers, config) {
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

        tableCustomers.findAll({ where: { relation_id: verification.relation_id } })
          .then((users) => {
            const customerList = users.map((user) => {
              return {
                customer_id: user.customer_id,
                forename: user.forname,
                surname: user.surname,
                phone: user.phone,
                email: user.email
              }
            })

            return response
              .status(200)
              .send({
                customer_list: customerList
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

module.exports = customerAllGet
