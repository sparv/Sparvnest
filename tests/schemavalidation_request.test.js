const test = require(`ava`)
const Joi = require(`joi`)
const schema = require(`../components/routing/schemavalidation_request`)

const testObjects = {
  requestHeader: {
    working: {
      bearerToken: {
        token: `Bearer slkfnio323nf.f23inf023f32-f23f2n3f23f23f.f3232f23`
      }
    },
    failing: {
      bearerToken: {
        token: `Bacon ipsum dolor amet meatloaf`
      }
    }
  },
  requestParams: {
    working: {
      customerId: {
        customer_id: `lak123123-asfsadr123312-sdfaf123412`
      }
    },
    failing: {
      customerId: {
        customer_id: `Bacon ipsum dolor amet meatloaf`
      }
    }
  },
  requestBody: {
    working: {
      userRegistration: {
        email: `Bacon@ipsum.dolor`,
        password: `Baconipsumdolorametmeatloaf`,
        forename: `Bacon ipsum dolor amet meatloaf`,
        surname: `Bacon ipsum dolor amet meatloaf`
      },
      userUpdate: {
        meta: {
          email: `Bacon@ipsum.dolor`,
          forename: `Bacon ipsum dolor amet meatloaf`,
          surname: `Bacon ipsum dolor amet meatloaf`
        },
        security: {
          password_old: `Baconipsumdolorametmeatloaf`,
          password_new: `Baconipsumdolorametmeatloafnew`
        }
      },
      userDelete: {
        password: `Baconipsumdolorametmeatloafnew`
      },
      customerAdd: {
        forename: `Bacon ipsum dolor amet meatloaf`,
        surname: `Bacon ipsum dolor amet meatloaf`,
        email: `Bacon@ipsum.dolor`,
        phone: `+00 123445566879`,
        gender: `Bacon`,
        age: `0`
      },
      customerUpdate: {
        forename: `Bacon ipsum dolor amet meatloaf`,
        surname: `Bacon ipsum dolor amet meatloaf`,
        phone: `+00 123445566879`,
        email: `Bacon@ipsum.dolor`,
        gender: `Bacon`,
        age: `0`
      },
      customerDelete: {
        surname: `Bacon ipsum dolor amet meatloaf`
      }
    },
    failing: {
      userRegistration: {
        email: `Bacon ipsum.dolor`,
        password: null,
        forename: `Bacon1337`,
        surname: `Bacon1337`
      },
      userUpdate: {
        meta: {
          email: `Bacon ipsum.dolor`,
          forename: `Bacon1337`,
          surname: `Bacon1337`
        },
        security: {
          password_old: null,
          password_new: null
        }
      },
      userDelete: {
        password: null
      },
      customerAdd: {
        relation_id: `lak123123<Bacon>-asfsadr12.;;23312-sdfaf123412`,
        forename: `Bacon1337`,
        surname: `Bacon1337`,
        email: `Bacon ipsum.dolor`,
        phone: `Bacon ipsum dolor amet meatloaf`,
        gender: `000`,
        age: `Bacon`
      },
      customerUpdate: {
        forename: `Bacon1337`,
        surname: `Bacon1337`,
        email: `Bacon ipsum.dolor`,
        phone: `Bacon ipsum dolor amet meatloaf`,
        gender: `000`,
        age: `Bacon`
      },
      customerDelete: {
        surname: `Bacon1337`
      }
    }
  }
}

test(`Validation of valid Bearer Token in Request Header`, async t => {
  await t.notThrows(Joi.validate(testObjects.requestHeader.working.bearerToken, schema.user_profile_get.requestHeader))
})

test(`Validation of void Bearer Token in Request Header`, async t => {
  await t.throws(Joi.validate(testObjects.requestHeader.failing.bearerToken, schema.user_profile_get.requestHeader))
})

test(`Validation of valid customerId as url-parameter`, async t => {
  await t.notThrows(Joi.validate(testObjects.requestParams.working.customerId, schema.customer_get.requestParams))
})

test(`Validation of void customerId as url-parameter`, async t => {
  await t.throws(Joi.validate(testObjects.requestParams.failing.customerId, schema.customer_get.requestParams))
})

test(`Validation of valid user registration request body`, async t => {
  await t.notThrows(Joi.validate(testObjects.requestBody.working.userRegistration, schema.user_registration.requestBody))
})

test(`Validation of void user registration request body`, async t => {
  await t.throws(Joi.validate(testObjects.requestBody.failing.userRegistration, schema.user_registration.requestBody))
})

test(`Validation of valid user update request body`, async t => {
  await t.notThrows(Joi.validate(testObjects.requestBody.working.userUpdate, schema.user_update.requestBody))
})

test(`Validation of void user update request body`, async t => {
  await t.throws(Joi.validate(testObjects.requestBody.failing.userUpdate, schema.user_update.requestBody))
})

test(`Validation of valid user delete request body`, async t => {
  await t.notThrows(Joi.validate(testObjects.requestBody.working.userDelete, schema.user_delete.requestBody))
})

test(`Validation of void user delete request body`, async t => {
  await t.throws(Joi.validate(testObjects.requestBody.failing.userDelete, schema.user_delete.requestBody))
})

test(`Validation of valid customer add request body`, async t => {
  await t.notThrows(Joi.validate(testObjects.requestBody.working.customerAdd, schema.customer_add.requestBody))
})

test(`Validation of void customer add request body`, async t => {
  await t.throws(Joi.validate(testObjects.requestBody.failing.customerAdd, schema.customer_add.requestBody))
})

test(`Validation of valid customer update request body`, async t => {
  await t.notThrows(Joi.validate(testObjects.requestBody.working.customerUpdate, schema.customer_update.requestBody))
})

test(`Validation of void customer update request body`, async t => {
  await t.throws(Joi.validate(testObjects.requestBody.failing.customerUpdate, schema.customer_update.requestBody))
})

test(`Validation of valid customer delete request body`, async t => {
  await t.notThrows(Joi.validate(testObjects.requestBody.working.customerDelete, schema.customer_delete.requestBody))
})

test(`Validation of void customer delete request body`, async t => {
  await t.throws(Joi.validate(testObjects.requestBody.failing.customerDelete, schema.customer_delete.requestBody))
})
