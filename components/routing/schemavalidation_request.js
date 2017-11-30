const Joi = require(`joi`)

const schema = {
  // User login won't be validated until it got rewritten
  // user_login: Joi.object().keys({}),
  user_registration: {
    requestBody: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        forename: Joi.string().regex(/^[a-zA-Z\s]+$/).required(),
        surname: Joi.string().regex(/^[a-zA-Z\s]+$/).required()
      })
  },
  user_profile_get: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    })
  },
  user_update: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    }),
    requestBody: {
      meta: Joi.object().min(1).keys({
        email: Joi.string().email(),
        forename: Joi.string().regex(/^[a-zA-Z\s]+$/),
        surname: Joi.string().regex(/^[a-zA-Z\s]+$/)
      }),
      security: Joi.object().keys({
        password_old: Joi.string().required(),
        password_new: Joi.string().required()
      })
    }
  },
  user_delete: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    }),
    requestBody: Joi.object().keys({
      password: Joi.string().required()
    })
  },
  customer_all_get: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    })
  },
  customer_get: {
    requestParams: Joi.object().keys({
      customer_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    })
  },
  customer_add: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    }),
    requestBody: Joi.object().keys({
      relation_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required(),
      forename: Joi.string().regex(/^[a-zA-Z\s]+$/).required(),
      surname: Joi.string().regex(/^[a-zA-Z\s]+$/).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().regex(/^[0-9 +-]+$/).required(),
      gender: Joi.string().regex(/^[a-zA-Z]+$/).required(),
      age: Joi.string().regex(/^[0-9]+$/).required()
    })
  },
  customer_update: {
    requestParams: Joi.object().keys({
      customer_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    }),
    requestBody: Joi.object().keys({
      forename: Joi.string().regex(/^[a-zA-Z\s]+$/),
      surname: Joi.string().regex(/^[a-zA-Z\s]+$/),
      phone: Joi.string().regex(/^[0-9 +-]+$/),
      email: Joi.string().email(),
      gender: Joi.string().regex(/^[a-zA-Z]+$/),
      age: Joi.string().regex(/^[0-9]+$/),
    })
  },
  customer_delete: {
    requestParams: Joi.object().keys({
      customer_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    }),
    requestBody: Joi.object().keys({
      surname: Joi.string().regex(/^[a-zA-Z\s]+$/)
    })
  }
}

module.exports = schema
