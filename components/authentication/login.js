const passport = require(`passport`)
const LocalStrategy = require(`passport-local`).Strategy
const crypto = require(`crypto`)

function login (dbTable) {
  passport.use(`login`, new LocalStrategy({
    passReqToCallback: true,
    usernameField: `email`
  },
  function (req, username, password, done) {
    dbTable.findOne({ where: { email: decodeURIComponent(username) } })
    .then((user) => {
      if (user == null) {
        return done(null, false)
      }

      const hash = crypto.pbkdf2Sync(password, user.salt, 100000, 512, `sha512`).toString(`base64`)

      if (user.password === hash) {
        console.log(`User authenticated`)
        return done(null, user)
      }

      return done(null, false)
    })
  }))
}

module.exports = login
