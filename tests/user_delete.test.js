const test = require(`ava`)
const httpMocks = require(`node-mocks-http`)
const jwt = require(`jsonwebtoken`)

const userRegistration = require(`../components/database/user_registration`)
const userDelete = require(`../components/database/user_delete`)
const initDb = require(`../components/database/init`)
const tables = require(`../components/database/tables`)
const config = require(`../config.json`)

const db = initDb(config)
const tableUsers = tables.Users(db)
const beforeTestRequestBody = {
    email: "user_delete@unit.test",
    password: "test",
    forename: "test",
    surname: "test"
}

const beforeTestResponse = httpMocks.createResponse()

test.before(async t => {
  await tableUsers.destroy({ where: { email: beforeTestRequestBody.email } })
})

test.beforeEach(async t => {
  await userRegistration(beforeTestResponse, tableUsers, beforeTestRequestBody, config)
    .then(() => {
      const testJwtPayload = {
        sub: `user_authentication`,
        name: beforeTestRequestBody.email,
        relation_id: beforeTestResponse._getData().relation_id
      }

      const testBearerToken = jwt.sign(testJwtPayload, config.auth.secret)

      t.context.request = httpMocks.createRequest({
        method: `PUT`,
        headers: {
          "Authorization": `Bearer ${testBearerToken}`
        }
      })

      t.context.response = httpMocks.createResponse()
    })
})

test.serial(`Delete user account`, async t => {
  const requestBody = {
    password: "test"
  }

  const request = t.context.request
  request._setBody(requestBody)

  await userDelete(request, t.context.response, tableUsers, config)
    .then(() => {
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.afterEach(async t => {
  await tableUsers.destroy({ where: { email: beforeTestRequestBody.email } })
})
