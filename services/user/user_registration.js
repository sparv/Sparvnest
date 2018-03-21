const Joi = require(`joi`)

const errorMap = require(`../../lib/helper/errorMap`)
const userAdd = require(`../../lib/user/userAdd`)

const schemaBody = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  forename: Joi.string().required(),
  surname: Joi.string().required()
})

const registerUser = async (response, data) => {
  try {
    const validationBody = await Joi.validate(data, schemaBody)
    const registration = await userAdd(data)

    return response
      .status(200)
      .send(registration)
  } catch (error) {
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = registerUser 
