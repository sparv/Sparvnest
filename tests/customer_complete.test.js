const test = require(`ava`)
const httpMocks = require(`node-mocks-http`)
const jwt = require(`jsonwebtoken`)

const userRegistration = require(`../components/database/user_registration`)
const customerAdd = require(`../components/database/customer_add`)
const customerAllGet = require(`../components/database/customer_all_get`)
const customerDelete = require(`../components/database/customer_delete`)
const customerGet = require(`../components/database/customer_get`)
const customerUpdate = require(`../components/database/customer_update`)

const initDb = require(`../components/database/init`)
const tables = require(`../components/database/tables`)
const config = require(`../config.json`)

const db = initDb(config)
const tableUsers = tables.Users(db)
const tableCustomers = tables.Customers(db)
const beforeTestRequestBody = {
    email: "customer_complete@unit.test",
    password: "test",
    forename: "test",
    surname: "test"
}

const beforeTestResponse = httpMocks.createResponse()

test.before(async t => {
  await tableUsers.destroy({ where: { email: beforeTestRequestBody.email } })
  await userRegistration(beforeTestResponse, tableUsers, beforeTestRequestBody, config)
})

test.beforeEach(async t => {
  await tableUsers.findOne({ where: { email: beforeTestRequestBody.email} })
    .then((user) => {
      const testJwtPayload = {
        sub: `user_authentication`,
        name: user.email,
        relation_id: user.relation_id
      }

      const testBearerToken = jwt.sign(testJwtPayload, config.auth.secret)

      t.context.relationId = user.relation_id
      t.context.bearerToken = testBearerToken

      t.context.request = httpMocks.createRequest({
        method: `PUT`,
        headers: {
          "Authorization": `Bearer ${testBearerToken}`
        }
      })

      t.context.response = httpMocks.createResponse()
    })
})

test.serial(`Add customer`, async t => {
  const requestBody = {
    forename: `testcustomer`,
    surname: `testcustomer`,
    email: `testcustomer@unit.test`,
    phone: `0123456789`,
    gender: `test`,
    age: `0`
  }

  const request = t.context.request
  request._setBody(requestBody)

  await customerAdd(request, t.context.response, tableCustomers, config)
    .then(() => {
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial(`List all customers`, async t => {
  await customerAllGet(t.context.request, t.context.response, tableCustomers, config)
    .then(() => {
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial(`Get single customer`, async t => {
  await customerAllGet(t.context.request, t.context.response, tableCustomers, config)
    .then(async () => {
      const responseBody = t.context.response._getData()
      const customerId = responseBody.customer_list[0].customer_id
      const request = httpMocks.createRequest({
        method: `GET`,
        url: `/customers`,
        params: {
          customerId: customerId
        },
        headers: {
          "Authorization": `Bearer ${t.context.bearerToken}`
        }
      })

      const response = httpMocks.createResponse()

      await customerGet(request, response, tableCustomers, config)
        .then(() => {
          t.pass()
        })
        .catch(() => {
          t.fail()
        })
    })
})

test.serial(`Update customer`, async t => {
  await customerAllGet(t.context.request, t.context.response, tableCustomers, config)
    .then(async () => {
      const responseBody = t.context.response._getData()
      const customerId = responseBody.customer_list[0].customer_id
      const request = httpMocks.createRequest({
        method: `PUT`,
        url: `/customers`,
        params: {
          customerId: customerId
        },
        headers: {
          "Authorization": `Bearer ${t.context.bearerToken}`
        }
      })

      const requestBodyUpdate = {
        forename: `testcustomerupdate`,
        surname: `testcustomerupdate`,
        email: `testcustomerupdate@unit.test`,
        phone: `987656443210`,
        gender: `testupdate`,
        age: `1`
      }

      request._setBody(requestBodyUpdate)

      const response = httpMocks.createResponse()

      await customerUpdate(request, response, tableCustomers, config)
        .then(() => {
          t.pass()
        })
        .catch(() => {
          t.fail()
        })
    })
})

test.serial(`Delete customer`, async t => {
  await customerAllGet(t.context.request, t.context.response, tableCustomers, config)
    .then(async () => {
      const responseBody = t.context.response._getData()
      const customerId = responseBody.customer_list[0].customer_id
      const request = httpMocks.createRequest({
        method: `DELETE`,
        url: `/customers`,
        params: {
          customerId: customerId
        },
        headers: {
          "Authorization": `Bearer ${t.context.bearerToken}`
        }
      })

      const requestBodyDelete = {
        surname: `testcustomerupdate`,
      }

      request._setBody(requestBodyDelete)

      const response = httpMocks.createResponse()

      await customerDelete(request, response, tableCustomers, config)
        .then(() => {
          t.pass()
        })
        .catch(() => {
          t.fail()
        })
    })

})

test.after(async t => {
  await tableCustomers.destroy({ where: { email: `testcustomer@unit.test` } })
  await tableUsers.destroy({ where: { email: beforeTestRequestBody.email } })
})
