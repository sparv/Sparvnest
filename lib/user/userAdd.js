const jwt = require(`jsonwebtoken`)

const hashPassword = require(`../helper/hash_password`)
const createSalt = require(`../helper/create_salt`)

const User = require(`../../models/User`)

const config = require(`../../server/config`)

const userAdd = (data) => {
  return new Promise((resolve, reject) => {
    const userEmail = data.email.toLowerCase()

    User.findOne({ where: { email: userEmail } })
      .then(user => {
        if (user) {
          reject({
            name: `DatabaseError`,
            message: `User not registered - there is already a user registered with this email adress`
          })
        } else {
          const salt = createSalt()

          User.create({
            email: userEmail,
            password: hashPassword(data.password, salt),
            salt: salt,
            forename: data.forename,
            surname: data.surname
          })
            .then(user => {
              const jwtPayload = {
                sub: `user_authentication`,
                name: user.email,
                relation_id: user.relation_id
              }

              const token = jwt.sign(jwtPayload, config.auth.secret)

              resolve({
                user: {
                  relation_id: user.relation_id,
                  forename: user.forename,
                  surname: user.surname,
                  email: user.email,
                  token: token
                }
              })
            })
        }
      })
      .catch(error => {
        reject({
          name: `DatabaseError`,
          message: error
        })
      })
  })
}

module.exports = userAdd
