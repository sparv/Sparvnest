const jwt = require(`jsonwebtoken`)

const hashPassword = require(`../helper/hash_password`)
const createSalt = require(`../helper/create_salt`)

const User = require(`../../models/User`)

const config = require(`../../server/config`)

const userAdd = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userEmail = data.email.toLowerCase()

      const userFound = await User.findOne({ where: { email: userEmail } })

      if (userFound) {
        reject({
          name: `DatabaseError`,
          message: `User not registered - there is already a user registered with this email adress`
        })
      } else {
        const salt = createSalt()

        const userCreated = await User.create({
          email: userEmail,
          password: hashPassword(data.password, salt),
          salt: salt,
          forename: data.forename,
          surname: data.surname
        })

        const jwtPayload = {
          sub: `user_authentication`,
          name: userCreated.email,
          relation_id: userCreated.relation_id
        }

        const token = jwt.sign(jwtPayload, config.auth.secret)

        resolve({
          user: {
            relation_id: userCreated.relation_id,
            forename: userCreated.forename,
            surname: userCreated.surname,
            email: userCreated.email,
            token: token
          }
        })
      }
    } catch (error) {
      reject({
        name: `DatabaseError`,
        message: error
      })
    }
  })
}

module.exports = userAdd
