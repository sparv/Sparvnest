const crypto = require(`crypto`)

const getUser = require(`../../lib/user/userGet`)
const hashPassword = require(`../../lib/helper/hash_password`)
const generateRefreshToken = require(`../../lib/authentication/generateRefreshToken`)

const login = (request, response) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = request.body
      const gathering = await getUser(email)
      const hashedRequestPassword = hashPassword(password, gathering.user.salt)

      const isSamePassword = gathering.user.password === hashedRequestPassword

      if (isSamePassword) {
        delete gathering.user.salt
        delete gathering.user.password

        const token = generateRefreshToken(gathering.user)

        resolve(response
          .status(200)
          .cookie(`refresh_token`, token, { httpOnly: true })
          .send(gathering.user)
        )
      }

      throw Error()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = login
