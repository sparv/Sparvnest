const Joi = require(`joi`)

const schema = {
  // User login won't be validated until it got rewritten
  // user_login: Joi.object().keys({}),
  user_registration: {
    requestBody: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        forename: Joi.string().required(),
        surname: Joi.string().required()
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
        forename: Joi.string(),
        surname: Joi.string()
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
      forename: Joi.string().required(),
      surname: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string(),
      gender: Joi.string(),
      age: Joi.string(),
      notes: Joi.string()
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
      forename: Joi.string(),
      surname: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
      gender: Joi.string(),
      age: Joi.string(),
      notes: Joi.string()
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
      surname: Joi.string().required()
    })
  },
  exercise_add: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    }),
    requestBody: Joi.object().keys({
      name: Joi.string().required(),
      level: Joi.string().required(),
      description: Joi.string()
    })
  },
  exercise_all_get: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    })
  },
  exercise_get: {
    requestParams: Joi.object().keys({
      exercise_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    })
  },
  exercise_update: {
    requestParams: Joi.object().keys({
      exercise_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    }),
    requestBody: Joi.object().min(1).keys({
      name: Joi.string(),
      level: Joi.string(),
      description: Joi.string()
    })
  },
  exercise_delete: {
    requestParams: Joi.object().keys({
      exercise_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    }),
    requestBody: Joi.object().keys({
      name: Joi.string()
    })
  },
  token_refresh: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    })
  }
}

module.exports = schema
