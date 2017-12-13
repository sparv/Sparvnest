const test = require(`ava`)
const httpMocks = require(`node-mocks-http`)
const tokenRefresh = require(`../components/authentication/token_refresh`)
const jwt = require(`jsonwebtoken`)
const config = require(`../config.json`)

test.beforeEach(t => {
  const testJwtPayload = {
    sub: `user_authentication`,
    name: `test@test.de`,
    relation_id: `12345-12345-12345-12345`
  }

  const testJwtOptions = {
    expiresIn: `15m`
  }

  const testBearerToken = jwt.sign(testJwtPayload, config.auth.secret, testJwtOptions)

  t.context.request = httpMocks.createRequest({
    method: `PUT`,
    headers: {
      "Authorization": `Bearer ${testBearerToken}`
    }
  })

  t.context.response = httpMocks.createResponse()
})

test(`Refresh valid token`, async t => {
  await tokenRefresh(t.context.request, t.context.response, config)
    .then(() => {
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})
