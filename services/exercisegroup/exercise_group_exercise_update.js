const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const exerciseGroupGet = require(`../../lib/exercisegroup/exerciseGroupGet`)
const exerciseUpdate = require(`../../lib/exercise/exerciseUpdate`)

const config = require(`../../server/config`)

function updatingExerciseInDatabase (request, response) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.exercise_update.requestHeader)
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
            const { exercisegroupId, exerciseId} = request.params

            Joi.validate({exercise_id: exerciseId}, schema.exercise_update.requestParams)
              .then(() => {
                Joi.validate(request.body, schema.exercise_update.requestBody)
                  .then(() => {
                    exerciseGroupGet(exercisegroupId, verification.relation_id)
                      .then(() => {
                        exerciseUpdate(exerciseId, exercisegroupId, request.body)
                          .then(info => {
                            resolve(response
                              .status(200)
                              .send({ message: info.message }))
                          })
                          .catch(info => {
                            reject(response
                              .status(500)
                              .send({ message: info.message }))
                          })
                      })
                      .catch(error => {
                        reject(response
                          .status(500)
                          .send({
                            message: error
                          })
                        )
                      })
                  })
                  .catch(error => {
                    console.error(error)

                    reject(response
                      .status(500)
                      .send({
                        message: `[${error.name}] ${error.details[0].message}`
                      }))
                  })
              })
              .catch(error => {
                console.error(error)

                reject(response
                  .status(500)
                  .send({
                    message: `[${error.name}] ${error.details[0].message}`
                  }))
              })
          }
        })
      })
      .catch(error => {
        console.log(error)

        reject(response
          .status(500)
          .send({
            message: `[${error.name}] ${error.details[0].message}`
          }))
      })
  })
}

module.exports = updatingExerciseInDatabase
