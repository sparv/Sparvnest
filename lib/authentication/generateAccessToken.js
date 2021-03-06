const jwt = require(`jsonwebtoken`)

const config = require(`../../server/config`)

const generateAccessToken = (user) => {
  const payload = {
    sub: `resource_access`,
    email: user.email,
    user_id: user.user_id
  }

  const options = {
    expiresIn: config.auth.access_token.expiration
  }

  const token = jwt.sign(payload, config.auth.access_token.secret, options)

  return token
}

module.exports = generateAccessToken
