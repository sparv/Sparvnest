const crypto = require(`crypto`)

const getUser = require(`../../lib/user/userGet`)
const hashPassword = require(`../../lib/helper/hash_password`)
const generateRefreshToken = require(`../../lib/authentication/generateRefreshToken`)
const generateAccessToken = require(`../../lib/authentication/generateAccessToken`)

const login = async (request, response) => {
  try {
    const { email, password } = request.body
    const gathering = await getUser(email)
    const hashedRequestPassword = hashPassword(password, gathering.user.salt)

    const isSamePassword = gathering.user.password === hashedRequestPassword

    if (isSamePassword) {
      delete gathering.user.salt
      delete gathering.user.password

      const refreshToken = generateRefreshToken(gathering.user)
      const accessToken = generateAccessToken(gathering.user)

      gathering.user[`token`] = accessToken

      return response
        .status(200)
        .cookie(`refresh_token`, refreshToken, { httpOnly: true })
        .send(gathering.user)
    }

    throw Error()
  } catch (error) {
    return response
      .status(500)
      .send(error)
  }
}

module.exports = login
