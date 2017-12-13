const passport = require(`passport`)
const userRegistration = require(`../database/user_registration`)
const userUpdate = require(`../database/user_update`)
const userProfileGet = require(`../database/user_profile_get`)
const userDelete = require(`../database/user_delete`)
const customerAllGet = require(`../database/customer_all_get`)
const customerGet = require(`../database/customer_get`)
const customerAdd = require(`../database/customer_add`)
const customerUpdate = require(`../database/customer_update`)
const customerDelete = require(`../database/customer_delete`)
const exerciseAdd = require(`../database/exercise_add`)
const exerciseAllGet = require(`../database/exercise_all_get`)
const exerciseGet = require(`../database/exercise_get`)
const exerciseUpdate = require(`../database/exercise_update`)
const exerciseDelete = require(`../database/exercise_delete`)
const tokenRefresh = require(`../authentication/token_refresh`)
const jwt = require(`jsonwebtoken`)

const hashPassword = require(`../database/hash_password`)

function routing (server, tableUsers, tableCustomers, tableExercises, config) {
  server.use((req, res, next) => {
    res.append(`Access-Control-Allow-Origin`, [`http://localhost:3000`])
    res.append(`Access-Control-Allow-Headers`, [`Authorization`, `Content-Type`])
    res.append(`Access-Control-Allow-Methods`, ['GET, POST, PUT, DELETE, OPTIONS'])
    next()
  })

  server.post(`/users`, (req, res) => {
    userRegistration(res, tableUsers, req.body, config)
      .then(() => {
        console.log(`[STATUS] User registered`)
      })
      .catch(error => {
        console.log(`[ERROR ${error.statusCode}]`)
      })
  })

  server.get(`/users`, (req, res) => {
    userProfileGet(req, res, tableUsers, config)
      .then(() => {
        console.log(`[STATUS] User profile gathered`)
      })
      .catch(error => {
        console.log(`[ERROR ${error.statusCode}]`)
      })

  })

  server.put(`/users`, (req, res) => {
    userUpdate(req, res, tableUsers, config)
      .then(() => {
        console.log(`[STATUS] User updated`)
      })
      .catch(error => {
        console.log(`[ERROR ${error.statusCode}]`)
      })
  })

  server.delete(`/users`, (req, res) => {
    userDelete(req, res, tableUsers, config)
      .then(() => {
        console.log(`[STATUS] User deleted`)
      })
      .catch(error => {
        console.log(`[ERROR ${error.statusCode}]`)
      })
  })

  //TODO Refactor to remove passport dependency
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

  server.get(`/customers`, (req, res) => {
    customerAllGet(req, res, tableCustomers, config)
      .then(() => {
        console.log(`[STATUS] Customer list gathered`)
      })
      .catch(error => {
        console.log(`[ERROR ${error.statusCode}]`)
      })
  })

  server.get(`/customers/:customerId`, (req, res) => {
    customerGet(req, res, tableCustomers, config)
      .then(() => {
        console.log(`[STATUS] Single customer gathered`)
      })
      .catch(error => {
        console.log(`[ERROR ${error.statusCode}]`)
      })
  })

  server.post(`/customers`, (req, res) => {
    customerAdd(req, res, tableCustomers, config)
      .then(() => {
        console.log(`[STATUS] Customer added`)
      })
      .catch(error => {
        console.log(`[ERROR ${error.statusCode}]`)
      })
  })

  server.put(`/customers/:customerId`, (req, res) => {
    customerUpdate(req, res, tableCustomers, config)
      .then(() => {
        console.log(`[STATUS] Customer updated`)
      })
      .catch(error => {
        console.log(`[ERROR ${error.statusCode}]`)
      })
  })

  server.delete(`/customers/:customerId`, (req, res) => {
    customerDelete(req, res, tableCustomers, config)
      .then(() => {
        console.log(`[STATUS] Customer deleted`)
      })
      .catch(error => {
        console.log(`[ERROR ${error.statusCode}]`)
      })
  })

  server.get(`/exercise`, (req, res) => {
    exerciseAllGet(req, res, tableExercises, config)
      .then(() => {
        console.log(`[STATUS] Exercise List gathered`)
      })
      .catch(error => {
        console.log(`[ERROR ${error.statusCode}]`)
      })
  })

  server.post(`/exercise`, (req, res) => {
    exerciseAdd(req, res, tableExercises, config)
      .then(() => {
        console.log(`[STATUS] Exercise added`)
      })
      .catch(error => {
        console.log(`[ERROR ${error.statusCode}]`)
      })
  })

  server.get(`/exercise/:exerciseId`, (req, res) => {
    exerciseGet(req, res, tableExercises, config)
      .then(() => {
        console.log(`[STATUS] Single Exercise gathered`)
      })
      .catch(error => {
        console.log(`[ERROR ${error.statusCode}]`)
      })
  })

  server.put(`/exercise/:exerciseId`, (req, res) => {
    exerciseUpdate(req, res, tableExercises, config)
      .then(() => {
        console.log(`[STATUS] Exercise updated`)
      })
      .catch(error => {
        console.log(`[ERROR ${error.statusCode}]`)
      })
  })

  server.delete(`/exercise/:exerciseId`, (req, res) => {
    exerciseDelete(req, res, tableExercises, config)
      .then(() => {
        console.log(`[STATUS] Exercise delete`)
      })
      .catch(error => {
        console.log(`[ERROR ${error.statusCode}]`)
      })
  })

  server.put(`/reauthenticate`, (req, res) => {
    tokenRefresh(req, res, config)
      .then(() => {
        console.log(`[STATUS] New token exposed`)
      })
      .catch(error => {
        console.log(`[ERROR ${error.statusCode}]`)
      })
  })

 // DEBUGGING PURPOSE ONLY
  server.get(`/resetDB`, (req, res) => {
    tableUsers.sync({force: true})
    tableCustomers.sync({force: true})
    tableExercises.sync({force: true})
   .then(() => {
     res.send(`db reset`)
     res.end()
   })
  })
}

module.exports = routing
