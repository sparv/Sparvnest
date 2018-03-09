const jwt = require(`jsonwebtoken`)

const config = require(`../../server/config`)

const generateRefreshToken = (user) => {
  const payload = {
    sub: `token_refresh`,
    email: user.email,
    relation_id: user.relation_id
  }

  const options = {
    expiresIn: config.auth.refresh_token.expiration
  }

  const token = jwt.sign(payload, config.auth.refresh_token.secret, options)

  return token
}

module.exports = generateRefreshToken
