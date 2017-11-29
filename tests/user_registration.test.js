const test = require(`ava`)
const httpMocks = require(`node-mocks-http`)

const userRegistration = require(`../components/database/user_registration`)
const initDb = require(`../components/database/init`)
const tables = require(`../components/database/tables`)
const config = require(`../config.json`)

const db = initDb(config)
const tableUsers = tables.Users(db)
const requestBody = {
    email: "user_registration@unit.test",
    password: "test",
    forename: "test",
    surname: "test"
}

const response = httpMocks.createResponse()

// Deleting user with same email adress from previous tests
test.before(t => {
  return tableUsers.destroy({
    where: {
      email: requestBody.email
    }
  })
})

test(`User registration`, t => {
  return userRegistration(response, tableUsers, requestBody, config)
    .then(() => {
      t.pass()
    })
    .catch(error => {
      t.fail()
    })
})
