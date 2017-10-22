const crypto = require(`crypto`)

function hashPassword (passwordString, salt) {
  return crypto.pbkdf2Sync(passwordString, salt, 100000, 512, `sha512`).toString(`base64`)
}

module.exports = hashPassword
