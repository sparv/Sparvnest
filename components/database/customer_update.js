const jwt = require(`jsonwebtoken`)

function customerUpdate (request, response, tableCustomers, config) {
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
              return response
                .status(200)
                .send({
                  message: `Customer updated`
                })
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
      .status(401)
      .send({
        message: `Authentication failed - no/wrong authentication token`
      })
  }
}

module.exports = customerUpdate
