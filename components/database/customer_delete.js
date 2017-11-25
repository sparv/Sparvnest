const jwt = require(`jsonwebtoken`)

function customerDelete (request, response, tableCustomers, config) {
  let token = ``

  if (request.headers.authorization !== undefined) {
    token = request.headers.authorization.replace(`Bearer `, ``)
  }

  if ((token !== `undefined`) && (token !== ``)) {
    jwt.verify(token, config.auth.secret, (err, verification) => {
      if (err) {
        return response
          .status(401)
          .send({
            message: `JWT authentication failed`
          })
      }

      tableCustomers.destroy({ where: {
        customer_id: request.params.customerId,
        relation_id: verification.relation_id,
        surname: request.body.surname
      } })
        .then((affectedRows) => {
          console.log(affectedRows)
          if (affectedRows === 0) {
            return response
              .status(400)
              .send({
                message: `No Customer deleted`
              })
          } else {
            return response
              .status(200)
              .send({
                message: `Customer deleted`
              })
          }
        })
        .catch((err) => {
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

module.exports = customerDelete