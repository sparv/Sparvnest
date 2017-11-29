const Joi = require('joi')

const schema = {
  // user_login: Joi.object().keys({}),
  user_registration: {
    requestBody: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        forename: Joi.string().regex(/^[a-zA-Z]+$/).required(),
        surname: Joi.string().regex(/^[a-zA-Z]+$/).required()
      })
  },
  user_profile_get: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9.-]+$/).required()
    })
  },
  user_update: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9.-]+$/).required()
    }),
    requestBody: {
      meta: Joi.object().min(1).keys({
        email: Joi.string().email(),
        forename: Joi.string().regex(/^[a-zA-Z]+$/),
        surname: Joi.string().regex(/^[a-zA-Z]+$/)
      }),
      security: Joi.object().keys({
        password_old: Joi.string().required(),
        password_new: Joi.string().required()
      })
    }
  },
  user_delete: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9.-]+$/).required()
    }),
    requestBody: Joi.object().keys({
      password: Joi.string().required()
    })
  },
  customer_all_get: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9.-]+$/).required()
    })
  },
  customer_get: {
    requestParams: Joi.object().keys({
      customer_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9.-]+$/).required()
    })
  },
  customer_add: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9.-]+$/).required()
    }),
    requestBody: Joi.object().keys({
      relation_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required(),
      forename: Joi.string().regex(/^[a-zA-Z\s]+$/).required(),
      surname: Joi.string().regex(/^[a-zA-Z\s]+$/).required(),
      email: Joi.string().email().required(),
      phone: Joi.number().required(),
      gender: Joi.string().required(),
      age: Joi.string().required()
    })
  },
  customer_update: {
    requestParams: Joi.object().keys({
      customer_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9.-]+$/).required()
    }),
    requestBody: Joi.object().keys({
      forename: Joi.string().regex(/^[a-zA-Z\s]+$/),
      surname: Joi.string().regex(/^[a-zA-Z\s]+$/),
      phone: Joi.number(),
      email: Joi.string().email(),
      gender: Joi.string(),
      age: Joi.string(),
    })
  },
  customer_delete: {
    requestParams: Joi.object().keys({
      customer_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9.-]+$/).required()
    }),
    requestBody: Joi.object().keys({
      surname: Joi.string().regex(/^[a-zA-Z\s]+$/)
    })
  }
}

module.exports = schema
