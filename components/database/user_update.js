// TODO authentication and full api specs implementation needed!!!
//
const hashPassword = require(`./hash_password`)

function userUpdate (dbTable, data, callback) {
  dbTable.findOne({ where: { email: data.current.email } })
  .then((user) => {
    let updateData = {}
    if (data.update.email !== null) updateData[`email`] = data.update.email
    if (data.update.password !== null) updateData[`password`] = hashPassword(data.update.password, user.salt)

    dbTable.update(updateData, {
      where: { email: user.email }
    }).then(() => {
      callback(data.update.email)
    }).catch(() => {
      callback(null)
    })
  })
}

module.exports = userUpdate
