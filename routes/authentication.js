const passport = require(`passport`)
const jwt = require(`jsonwebtoken`)
const express = require(`express`)
const router = express.Router()

const tokenRefresh = require(`../lib/helper/token_refresh`)
const initLoginStrategy = require(`../services/authentication/login`)

initLoginStrategy()

router.post(`/`, (req, res) => {
  passport.authenticate(`login`, (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .send({
          message: `An error happened on the server side`
        })
    }
    if (!user) {
      return res
        .status(401)
        .send({
          message: `User authentication failed - Bad credentials`
        })
    } else {
      console.log(`asfa`)
      const jwtPayload = {
        sub: `user_authentication`,
        name: user.email,
        relation_id: user.relation_id
      }

      const jwtOptions = {
        expiresIn: config.auth.tokenExpirationTime
      }

      const token = jwt.sign(jwtPayload, config.auth.secret, jwtOptions)

      return res
        .status(200)
        .send({
          relation_id: user.relation_id,
          forename: user.forename,
          surname: user.surname,
          email: user.email,
          token: token
        })
    }
  })(req, res, next)
})

router.put(`/`, (req, res) => {
  tokenRefresh(req, res, config)
    .then(() => console.log(`[STATUS] New token exposed`))
    .catch(error => console.log(`[ERROR ${error.statusCode}]`))
})

module.exports = router
