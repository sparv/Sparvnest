const Joi = require(`joi`)

const schema = {
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
      phone: Joi.string().empty(''),
      gender: Joi.string().empty(''),
      age: Joi.string().empty(''),
      notes: Joi.string().empty('')
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
      forename: Joi.string().empty(''),
      surname: Joi.string().empty(''),
      email: Joi.string().email().empty(''),
      phone: Joi.string().empty(''),
      gender: Joi.string().empty(''),
      age: Joi.string().empty(''),
      notes: Joi.string().empty('')
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
      level: Joi.string().required().valid(`beginner`, `advanced`, `professional`),
      description: Joi.string().empty('')
    })
  },
  exercise_all_get: {
    requestParams: Joi.object().keys({
      exercisegroup_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required(),
    }),
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
      name: Joi.string().empty(''),
      level: Joi.string().empty('').valid(`beginner`, `advanced`, `professional`),
      description: Joi.string().empty('')
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
      name: Joi.string().empty('')
    })
  },
  exercise_group_add: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    }),
    requestBody: Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().empty('')
    })
  },
  exercise_group_all_get: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    })
  },
  exercise_group_get: {
    requestParams: Joi.object().keys({
      exercisegroup_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    })
  },
  exercise_group_delete: {
    requestParams: Joi.object().keys({
      exercisegroup_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    })
  },
  exercise_group_update: {
    requestParams: Joi.object().keys({
      exercisegroup_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    }),
    requestBody: Joi.object().min(1).keys({
      name: Joi.string().empty(''),
      description: Joi.string().empty('')
    })
  },
  exercise_group_exercise_add: {
    requestParams: Joi.object().keys({
      exercisegroup_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    })
  },
  token_refresh: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    })
  },
  exercise_group_exercise_delete: {
    requestParams: Joi.object().keys({
      exercise_id: Joi.string().regex(/^[a-zA-Z0-9-]+$/).required()
    }),
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    })
  },
  token_refresh: {
    requestHeader: Joi.object().keys({
      token: Joi.string().regex(/^Bearer [a-zA-Z0-9._-]+$/).required()
    })
  }
}

module.exports = schema
