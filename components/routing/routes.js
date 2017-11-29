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
const jwt = require(`jsonwebtoken`)

const hashPassword = require(`../database/hash_password`)

function routing (server, tableUsers, tableCustomers, config) {
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
        console.log(`[ERROR ${error.statusCode}] User not registered`)
      })
  })

  server.get(`/users`, (req, res) => {
    userProfileGet(req, res, tableUsers, config)
  })

  server.put(`/users`, (req, res) => {
    userUpdate(req, res, tableUsers, config)
  })

  server.delete(`/users`, (req, res) => {
    userDelete(req, res, tableUsers, config)
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

        const token = jwt.sign(jwtPayload, config.auth.secret)

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
  })

  server.get(`/customers/:customerId`, (req, res) => {
    customerGet(req, res, tableCustomers, config)
  })

  server.post(`/customers`, (req, res) => {
    customerAdd(req, res, tableCustomers, config)
  })

  server.put(`/customers/:customerId`, (req, res) => {
    customerUpdate(req, res, tableCustomers, config)
  })

  server.delete(`/customers/:customerId`, (req, res) => {
    customerDelete(req, res, tableCustomers, config)
  })

 // DEBUGGING PURPOSE ONLY
  server.get(`/resetDB`, (req, res) => {
    tableUsers.sync({force: true})
    tableCustomers.sync({force: true})
   .then(() => {
     res.send(`db reset`)
     res.end()
   })
  })
}

module.exports = routing
