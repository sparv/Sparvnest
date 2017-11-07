const hashPassword = require(`./hash_password`)
const createSalt = require(`./create_salt`)

function userRegistration (dbTable, data, callback) {
  dbTable.findOne({ where: { email: data.email } })
  .then((user) => {
    if (user) {
      console.log(`User already registered`)
      callback(null, false, null)
    } else {
      const salt = createSalt()

      console.log(`PASSWORD: ${data.password}`)

      dbTable.create({
        email: data.email,
        password: hashPassword(data.password, salt),
        salt: salt,
        forename: data.forename,
        surname: data.surname
      }).then((user) => {
        console.log(`User ${user.email} created`)
        callback(null, true, user.email)
      })
    }
  })
  .catch((err) => {
    console.error(`Database error:`, err)
  })
}

module.exports = userRegistration
