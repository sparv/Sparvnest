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

  server.post(`/register`, (req, res) => {
    userRegistration(dbTable, req.body, (err, success, email) => {
      if (err) console.log(err)
      res.send({
        username: email,
        isRegistered: success
      })
      res.end()
    })
  })

  server.post(`/update`, (req, res) => {
    updateUser(dbTable, req.body, (user) => {
      dbTable.findOne({ where: { email: user } })
      .then((userdata) => {
        console.log(userdata)
        const token = jwt.sign({
          'sub': 'user_autentication',
          'name': userdata.email
        },
  config.auth.secret)

        res.send({
          email: userdata.email,
          name: userdata.name,
          token: token,
          isUpdated: true
        })
      })
    })
  })

  server.post(`/delete`, (req, res) => {
    const token = req.headers.authorization.replace(`Bearer `, ``)
    if ((token !== `undefined`) && (token !== ``)) {
      jwt.verify(token, config.auth.secret, (err, verification) => {
        if (err) {
          console.log(err)
          res.send({
            username: null,
            createdAt: null,
            isAuthenticated: false
          })
        }

        dbTable.findOne({ where: { email: verification.name } })
        .then((user) => {
          const hashedPassword = hashPassword(req.body.password, user.salt)

          if (hashedPassword === user.password) {
            dbTable.destroy({ where: { email: verification.name } })
            .then(() => {
              res.send({
                username: user.email,
                isDeleted: true
              })

              res.end()
            })
            .catch((err) => {
              console.log(err)
              res.send({
                username: user.email,
                isDeleted: false,
                error: err
              })

              res.end()
            })
          } else {
            res.send({
              username: user.email,
              isDeleted: false,
              error: `wrong password`
            })
          }
        })
        .catch((err) => {
          console.log(err)
          res.send({
            username: null,
            createdAt: null,
            isAuthenticated: false
          })

          res.end()
        })
      })
    }
  })

  server.post(`/validate`, (req, res) => {
    const token = req.headers.authorization.replace(`Bearer `, ``)
    console.log(`received token: ${token}`)

    if ((token !== `undefined`) && (token !== ``)) {
      console.log(`token available`)
      jwt.verify(token, config.auth.secret, (err, verification) => {
        if (err) {
          console.log(`err`)
          console.log(err)
          res.send({
            username: null,
            createdAt: null,
            isAuthenticated: false
          })
        }

        console.log(`verification`)
        console.log(verification)

        dbTable.findOne({ where: { email: verification.name } })
     .then((user) => {
       res.send({
         username: user.email,
         createdAt: user.createdAt,
         isAuthenticated: true
       })
       res.end()
     })
     .catch((err) => {
       if (err) console.log(err)

       res.send({
         username: null,
         createdAt: null,
         isAuthenticated: false
       })
       res.end()
     })
      })
    } else {
      res.send({
        username: null,
        createdAt: null,
        isAuthenticated: false
      })
      res.end()
    }
  })

  server.post(`/login`, (req, res, next) => {
    passport.authenticate(`login`, (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        console.log(`User not authenticated`)
        return res.send({
          auth: false,
          user: null,
          token: null
        })
      } else {
        const jwtPayload = {
          'sub': 'user_authentication',
          'name': user.email
        }

        const token = jwt.sign(jwtPayload, config.auth.secret)

        return res.send({
          auth: true,
          user: user.email,
          token: token,
          name: user.name
        })
      }
    })(req, res, next)
  })

  server.post(`/logout`, (req, res, next) => {
    if (req.isAuthenticated()) {
      req.logout()
      res.redirect(`/logout`)
    } else {
      res.redirect(`/register`)
    }
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
