const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const exerciseGet = require(`../../lib/exercise/exerciseGet`)
const exerciseAdd = require(`../../lib/exercise/exerciseAdd`)

const config = require(`../../server/config`)

function addExerciseToDatabase (request, response) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.exercise_add.requestHeader)
      .then(() => {
        const strippedToken = auth.token.replace(`Bearer `, ``)

        jwt.verify(strippedToken, config.auth.secret, (error, verification) => {
          if (error) {
            console.log(error)

            if (error.name === `TokenExpiredError`) {
              reject(response
                .status(510)
                .send({
                  message: `JWT token expired`
                }))
            } else {
              reject(response
                .status(401)
                .send({
                  message: `JWT authentication failed`
                }))
            }
          } else {
            Joi.validate(request.body, schema.exercise_add.requestBody)
              .then(() => {
                exerciseGet({
                  name: request.body.name,
                  level: request.body.level
                })
                  .then(() => {
                    exerciseAdd(request.body)
                      .then(info => {
                        resolve(response
                          .status(info.status)
                          .send({ exercise: info.exercise })
                        )
                      })
                      .catch(info => {
                        reject(response
                          .status(info.status)
                          .send({ message: info.message })
                        )
                      })
                  })
                  .catch(info => {
                    reject(response
                      .status(info.status)
                      .send({ message: info.message }))
                  })
              })
              .catch(error => {
                console.error(error)

                reject(response
                  .status(500)
                  .send({
                    message: `[ERROR] Response body object validation failed`
                  }))
              })
          }
        })
      })
  })
}

module.exports = addExerciseToDatabase
