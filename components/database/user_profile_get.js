const jwt = require(`jsonwebtoken`)

function userProfileGet (request, response, tableUsers, config) {
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

      tableUsers.findOne({ where: { relation_id: verification.relation_id } })
        .then((user) => {
          return response
            .status(200)
            .send({
              email: user.email,
              forename: user.forename,
              surname: user.surname
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

module.exports = userProfileGet
