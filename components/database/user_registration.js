const hashPassword = require(`./hash_password`)
const createSalt = require(`./create_salt`)

function userRegistration (response, dbTable, data) {
  dbTable.findOne({ where: { email: data.email } })
  .then((user) => {
    if (user) {
      return response
        .status(403)
        .send({
          message: `User not registered - there is already a user registered with this email adress`
        })
    } else {
      const salt = createSalt()
      dbTable.create({
        email: data.email,
        password: hashPassword(data.password, salt),
        salt: salt,
        forename: data.forename,
        surname: data.surname
      }).then((user) => {
        return response
          .status(200)
          .send({
            email: data.email
          })
      })
    }
  })
  .catch((err) => {
    console.log(err)
    return response
      .status(500)
      .send({
        message: `An error happened on the server side`
      })
  })
}

module.exports = userRegistration
