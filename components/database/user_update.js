const hashPassword = require(`./hash_password`)

function userUpdate (dbTable, data, callback) {
  dbTable.findOne({ where: { email: data.current.email } })
  .then((user) => {
    console.log(`user salt: ${user.salt}`)

    let updateData = {}
    if (data.update.email !== null) updateData[`email`] = data.update.email
    if (data.update.password !== null) updateData[`password`] = hashPassword(data.update.password, user.salt)

    dbTable.update(updateData, {
      where: { email: user.email }
    }).then(() => {
      callback(data.update.email)
    })
  })
}

module.exports = userUpdate
