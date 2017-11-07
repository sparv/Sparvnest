const passport = require(`passport`)
const userRegistration = require(`../database/user_registration`)
const updateUser = require(`../database/user_update`)
const jwt = require(`jsonwebtoken`)

const hashPassword = require(`../database/hash_password`)

function routing (server, dbTable, config) {
  server.use((req, res, next) => {
    res.append(`Access-Control-Allow-Origin`, [`http://localhost:3000`])
    res.append(`Access-Control-Allow-Headers`, [`Authorization`, `Content-Type`])
    next()
  })

  server.post(`/users`, (req, res) => {
    userRegistration(dbTable, req.body, (err, success, email) => {
      if (err) {
        return res
          .status(500)
          .send({
            message: `An error happened on the server side`
          })
      }
      if (!success) {
        return res
          .status(403)
          .send({
            message: `User not registered - there is already a user registered with this email adress`
          })
      }

      if (success) {
        return res
          .status(200)
          .send({
            email: email,
          })
      }
    })
  })

  server.get(`/users/`, (req, res) => {
    const token = req.headers.authorization.replace(`Bearer `, ``)

    if ((token !== `undefined`) && (token !== ``)) {
      jwt.verify(token, config.auth.secret, (err, verification) => {
        if (err) {
          console.log(err)
          return res
            .status(401)
            .send({
              message: `JWT authentication failed`
          })
        }

        dbTable.findOne({ where: { uuid: verification.uuid } })
          .then((user) => {
            return res
              .status(200)
              .send({
                email: user.email,
                forename: user.forename,
                surname: user.surname
              })
          })
          .catch((err) => {
            if (err) console.log(err)

            return res
              .status(500)
              .send({
                message: `Internal server error`
              })
          })
      })
    } else {
      return res
        .status(400)
        .send({
          message: `Invalid data - cannot computed`
        })
    }
  })

  server.put(`/users`, (req, res) => {
    updateUser(dbTable, req.body, (user) => {
      dbTable.findOne({ where: { email: user } })
      .then((userdata) => {
        const token = jwt.sign({
          sub: `user_autentication`,
          name: userdata.email,
          uuid: userdata.uuid
        }, config.auth.secret)

        return res.send({
          message: `User data was updated`
        })
      })
    })
  })

  server.delete(`/users`, (req, res) => {
    const token = req.headers.authorization.replace(`Bearer `, ``)

    if ((token !== `undefined`) && (token !== ``)) {
      jwt.verify(token, config.auth.secret, (err, verification) => {
        if (err) {
          console.log(err)
          return res
            .status(401)
            .send({
              message: `User authentication failed`
            })
        }

        dbTable.findOne({ where: { email: verification.name } })
        .then((user) => {
          const hashedPassword = hashPassword(req.body.password, user.salt)

          if (hashedPassword === user.password) {
            dbTable.destroy({ where: { email: verification.name } })
            .then(() => {
              return res.send({
                message: `User deleted`
              })
            })
            .catch((err) => {
              console.log(err)
              return res
                .status(400)
                .send({
                  message: `The request cannot be computed - client sent invalid data to server endpoint`
                })
            })
          } else {
            return res
              .status(401)
              .send({
                message: `User authentication failed`
              })
          }
        })
        .catch((err) => {
          console.log(err)
          return res
            .status(500)
            .send({
              message: `Internal Server Error`
            })
        })
      })
    }
  })

  server.post(`/login`, (req, res, next) => {
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
        const jwtPayload = {
          sub: `user_authentication`,
          name: user.email,
          uuid: user.uuid
        }

        const token = jwt.sign(jwtPayload, config.auth.secret)

        return res
          .status(200)
          .send({
            uuid: user.uuid,
            forename: user.forename,
            surname: user.surname,
            email: user.email,
            token: token,
        })
      }
    })(req, res, next)
  })

 // DEBUGGING PURPOSE ONLY
  server.get(`/resetDB`, (req, res) => {
    dbTable.sync({force: true})
   .then(() => {
     res.send(`db reset`)
     res.end()
   })
  })
}

module.exports = routing
