const crypto = require(`crypto`)

function createSalt () {
  return crypto.randomBytes(128).toString(`base64`)
}

module.exports = createSalt
