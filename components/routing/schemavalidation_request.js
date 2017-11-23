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
      meta: Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string(),
        forename: Joi.string().regex(/^[a-zA-Z]+$/),
        surname: Joi.string().regex(/^[a-zA-Z]+$/)
      }),
      security: Joi.object().keys({
        password_old: Joi.string(),
        password_new: Joi.string()
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
      customer_id: Joi.number().required()
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
      relation_id: Joi.number(),
      forename: Joi.string().regex(/^[a-zA-Z]+$/),
      surname: Joi.string().regex(/^[a-zA-Z]+$/),
      email: Joi.string().email(),
      phone: Joi.number(),
      gender: Joi.string(),
      age: Joi.string()
    })
  },
  customer_update: {
    requestParams: Joi.object().keys({
      customer_id: Joi.number().required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9.-]+$/).required()
    }),
    requestBody: Joi.object().keys({
      forename: Joi.string().regex(/^[a-zA-Z]+$/),
      surname: Joi.string().regex(/^[a-zA-Z]+$/),
      phone: Joi.number(),
      email: Joi.string().email(),
      gender: Joi.string(),
      age: Joi.string(),
    })
  },
  customer_delete: {
    requestParams: Joi.object().keys({
      customer_id: Joi.number().required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9.-]+$/).required()
    }),
    requestBody: Joi.object().keys({
      surname: Joi.string().regex(/^[a-zA-Z]+$/)
    })
  }
}

module.exports = schema
