const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)

const errorMap = require(`./errorMap`)
const validateRefreshToken = require(`./validateRefreshToken`)
const generateAccessToken = require(`../authentication/generateAccessToken`)

function tokenRefresh (request, response, config) {
  return new Promise(async (resolve, reject) => {
    try {
      const refreshTokenPayload = await validateRefreshToken(request.headers.cookie) 

      delete refreshTokenPayload.sub

      const accessToken = await generateAccessToken(refreshTokenPayload)

      resolve(response
        .status(200)
        .send({ token: accessToken})
      )

    } catch (error) {
      const mapping = errorMap(error)

      console.log(error)

      reject(response
        .status(mapping.status)
        .send(mapping)
      )
    }
  })
}

module.exports = tokenRefresh
