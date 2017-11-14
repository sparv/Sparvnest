const jwt = require(`jsonwebtoken`)
const hashPassword = require(`./hash_password`)
const createSalt = require(`./create_salt`)

function userRegistration (response, dbTable, data, config) {
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
        const jwtPayload = {
          sub: `user_authentication`,
          name: user.email,
          relation_id: user.relation_id
        }

        const token = jwt.sign(jwtPayload, config.auth.secret)

        return response
          .status(200)
          .send({
            relation_id: user.relation_id,
            forename: user.forename,
            surname: user.surname,
            email: user.email,
            token: token
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
