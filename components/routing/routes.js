const passport = require(`passport`)
const userRegistration = require(`../database/user_registration`)
const updateUser = require(`../database/user_update`)
const jwt = require(`jsonwebtoken`)

const hashPassword = require(`../database/hash_password`)

function routing (server, tableUsers, tableCustomers, config) {
  server.use((req, res, next) => {
    res.append(`Access-Control-Allow-Origin`, [`http://localhost:3000`])
    res.append(`Access-Control-Allow-Headers`, [`Authorization`, `Content-Type`])
    next()
  })

  server.post(`/users`, (req, res) => {
    userRegistration(tableUsers, req.body, (err, success, email) => {
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
            email: email
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

        tableUsers.findOne({ where: { relation_id: verification.relation_id } })
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
    updateUser(tableUsers, req.body, (user) => {
      tableUsers.findOne({ where: { email: user } })
      .then((userdata) => {
        // send token back to client for authentication with new userdata
        const token = jwt.sign({
          sub: `user_autentication`,
          name: userdata.email,
          relation_id: userdata.relation_id
        }, config.auth.secret)

        return res.send({
          message: `User data was updated`,
          token: token
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

        tableUsers.findOne({ where: { email: verification.name } })
        .then((user) => {
          const hashedPassword = hashPassword(req.body.password, user.salt)

          if (hashedPassword === user.password) {
            tableUsers.destroy({ where: { email: verification.name } })
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

        console.log(`veri`)
        console.log(verification.relation_id)

        tableCustomers.findAll({ where: { relation_id: verification.relation_id } })
          .then((users) => {
            console.log(users)
            const customerList = users.map((user) => {
              return {
                customer_id: user.customer_id,
                forename: user.forname,
                surname: user.surname,
                phone: user.phone,
                email: user.email
              }
            })

            return res
              .status(200)
              .send({
                customer_list: customerList
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

  server.get(`/customers/:customerId`, (req, res) => {
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

        tableCustomers.findOne({ where: {
          customer_id: req.params.customerId,
          relation_id: verification.relation_id
        } })
          .then((customer) => {
            return res
              .status(200)
              .send({
                customer_id: customer.customer_id,
                forename: customer.forename,
                surname: customer.surname,
                phone: customer.phone,
                email: customer.email,
                gender: customer.gender,
                age: customer.age,
                dates: [],
                trainingplans: []
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

  server.post(`/customers`, (req, res) => {
    const token = req.headers.authorization.replace(`Bearer `, ``)

    if ((token !== `undefined`) && (token !== ``)) {
      jwt.verify(token, config.auth.secret, (err, verification) => {
        console.log(verification)
        if (err) {
          console.log(err)
          return res
            .status(401)
            .send({
              message: `JWT authentication failed`
            })
        }

        tableCustomers.findOne({ where: {
          email: req.body.email,
          relation_id: verification.relation_id
        } })
          .then((customer) => {
            if (customer) {
              return res
                .status(400)
                .send({
                  message: `customer already added`
                })
            } else {
              const data = req.body

              tableCustomers.create({
                relation_id: verification.relation_id,
                forename: data.forename,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                gender: data.gender,
                age: data.age
              }).then(customer => {
                return res
                  .status(200)
                  .send({
                    message: `Customer added`
                  })
              })
            }
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

  server.put(`/customers/:customerId`, (req, res) => {
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

        tableCustomers.findOne({ where: {
          customer_id: req.params.customerId,
          relation_id: verification.relation_id
        } })
          .then((customer) => {
            const data = req.body
            let updateData = {}

            if (data.forename !== null) updateData[`forename`] = data.forename
            if (data.surname !== null) updateData[`surname`] = data.surname
            if (data.email !== null) updateData[`email`] = data.email
            if (data.phone !== null) updateData[`phone`] = data.phone
            if (data.gender !== null) updateData[`gender`] = data.gender
            if (data.age !== null) updateData[`age`] = data.age

            tableCustomers.update(updateData, {
              where: { id: customer.id } })
              .then(() => {
                return res
                  .status(200)
                  .send({
                    message: `Customer updated`
                  })
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

  server.delete(`/customers/:customerId`, (req, res) => {
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

        tableCustomers.destroy({ where: {
          customer_id: req.params.customerId,
          relation_id: verification.relation_id,
          surname: req.body.surname
        } })
          .then((affectedRows) => {
            console.log(affectedRows)
            if (affectedRows === 0) {
              return res
                .status(400)
                .send({
                  message: `No Customer deleted`
                })
            } else {
              return res
                .status(200)
                .send({
                  message: `Customer deleted`
                })
            }
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
