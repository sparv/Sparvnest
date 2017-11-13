function userDelete (request, response, tableUsers) {
  const token = req.headers.authorization.replace(`Bearer `, ``)

  if ((token !== `undefined`) && (token !== ``)) {
    jwt.verify(token, config.auth.secret, (err, verification) => {
      if (err) {
        console.log(err)
        return response
          .status(401)
          .send({
            message: `User authentication failed`
          })
      }

      tableUsers.findOne({ where: { email: verification.name } })
      .then((user) => {
        const hashedPassword = hashPassword(request.body.password, user.salt)

        if (hashedPassword === user.password) {
          tableUsers.destroy({ where: { email: verification.name } })
          .then(() => {
            return response.send({
              message: `User deleted`
            })
          })
          .catch((err) => {
            console.log(err)
            return response
              .status(400)
              .send({
                message: `The request cannot be computed - client sent invalid data to server endpoint`
              })
          })
        } else {
          return response
            .status(401)
            .send({
              message: `User authentication failed`
            })
        }
      })
      .catch((err) => {
        console.log(err)
        return response
          .status(500)
          .send({
            message: `Internal Server Error`
          })
      })
    })
  }
}

module.exports = userDelete
