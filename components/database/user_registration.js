const hashPassword = require(`./hash_password`)
const createSalt = require(`./create_salt`)

function userRegistration (dbTable, data, callback) {
  dbTable.findOne({ where: { email: data.email } })
  .then((user) => {
    if (user) {
      callback(null, false, null)
    } else {
      const salt = createSalt()
      dbTable.create({
        email: data.email,
        password: hashPassword(data.password, salt),
        salt: salt,
        forename: data.forename,
        surname: data.surname
      }).then((user) => {
        callback(null, true, user.email)
      })
    }
  })
  .catch((err) => {
    console.error(`Database error:`, err)
  })
}

module.exports = userRegistration
