// TODO authentication and full api specs implementation needed!!!
//
const hashPassword = require(`./hash_password`)
const jwt = require(`jsonwebtoken`)

function userUpdate (request, response, tableUsers, config) {
  const data = request.body

  tableUsers.findOne({ where: { email: data.current.email } })
  .then((user) => {
    let updateData = {}
    if (data.update.email !== null) updateData[`email`] = data.update.email
    if (data.update.password !== null) updateData[`password`] = hashPassword(data.update.password, user.salt)

    tableUsers.update(updateData, {
      where: { email: user.email }
    })
    .then(() => {
      tableUsers.findOne({ where: { email: data.update.email } })
      .then((updatedUser) => {
        const token = jwt.sign({
          sub: `user_autentication`,
          name: updatedUser.email,
          relation_id: updatedUser.relation_id
        }, config.auth.secret)

        return response
          .status(200)
          .send({
            message: `User data was updated`,
            token: token
          })
      })
    })
    .catch(() => {
      return response
        .status(500)
        .send({
          message: `Internal Server error`
        })
    })
  })
}

module.exports = userUpdate
