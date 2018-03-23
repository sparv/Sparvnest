const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)

const errorMap = require(`./errorMap`)
const validateRefreshToken = require(`../authentication/validateRefreshToken`)
const generateAccessToken = require(`../authentication/generateAccessToken`)

const config = require(`../../server/config`)

const tokenRefresh = async (request, response, config) => {
  try {
    const refreshTokenPayload = await validateRefreshToken(request.headers.cookie) 

    delete refreshTokenPayload.sub

    const accessToken = await generateAccessToken(refreshTokenPayload)

    return response
      .status(200)
      .send({ token: accessToken})
  } catch (error) {
    const mapping = errorMap(error)

    return response
      .status(mapping.status)
      .send(mapping)
  }
}

module.exports = tokenRefresh
