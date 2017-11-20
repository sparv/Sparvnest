const joi = require('joi')

const schema = {
  user_login: Joi.object().keys({}),
  user_registration: Joi.object().keys({
    requestBody: {
      email: Joi.string().email().required()
      password: Joi.string().required()
      forename: Joi.string().regex(/^[a-zA-Z]$/).required()
      surname: Joi.string().regex(/^[a-zA-Z]$/).required()
    }
  }),
  user_profile_get: Joi.object().keys({
    requestHeader: {
      token: Joi.string().required()
    }
  }),
  user_update: Joi.object().keys({
    requestHeader: {
      token: Joi.string().required()
    },
    requestBody: {
      meta: {
        email: Joi.string().email()
        password: Joi.string()
        forename: Joi.string().regex(/^[a-zA-Z]$/)
        surname: Joi.string().regex(/^[a-zA-Z]$/)
      },
      security: {
        password_old: Joi.string()
        password_new: Joi.string()
      }
    }
  }),
  user_delete: Joi.object().keys({
    requestHeader: {
      token: Joi.string().required()
    },
    requestBody: {
      password: Joi.string().required()
    }
  }),
  customer_all_get: Joi.object().keys({
    requestHeader: {
      token: Joi.string().required()
    }
  }),
  customer_get: Joi.object().keys({
    requestParams: {
      customer_id: Joi.number().required()
    },
    requestHeader: {
      token: Joi.string().required()
    }
  }),
  customer_add: Joi.object().keys({
    requestHeader: {
      token: Joi.string().required()
    },
    requestBody: {
      relation_id: Joi.number()
      forename: Joi.string().regex(/^[a-zA-Z]$/)
      surname: Joi.string().regex(/^[a-zA-Z]$/)
      email: Joi.string().email()
      phone: Joi.number()
      gender: Joi.string()
      age: Joi.string()
    }
  }),
  customer_update: Joi.object().keys({
    requestParams: {
      customer_id: Joi.number().required()
    },
    requestHeader: {
      token: Joi.string().required()
    },
    requestBody: {
      forename: Joi.string().regex(/^[a-zA-Z]$/)
      surname: Joi.string().regex(/^[a-zA-Z]$/)
      phone: Joi.number()
      email: Joi.string().email()
      gender: Joi.string()
      age: Joi.string()
    }
  }),
  customer_delete: Joi.object().keys({
    requestParams: {
      customer_id: Joi.number().required()
    },
    requestHeader: {
      token: Joi.string().required()
    },
    requestBody: {
      surname: Joi.string().regex(/^[a-zA-Z]$/)
    }
  })
}

module.exports = schema
