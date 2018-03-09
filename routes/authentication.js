const passport = require(`passport`)
const express = require(`express`)
const router = express.Router()

const tokenRefresh = require(`../lib/helper/token_refresh`)
const initLoginStrategy = require(`../services/authentication/login`)
const generateRefreshToken = require(`../lib/authentication/generateRefreshToken`)

const config = require(`../server/config`)

initLoginStrategy()

router.post(`/`, (req, res, next) => {
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

      const token = generateRefreshToken(user)

      return res
        .status(200)
        .cookie(`refresh_token`, token, { httpOnly: true })
        .send({
          relation_id: user.relation_id,
          forename: user.forename,
          surname: user.surname,
          email: user.email
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
