const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const exerciseGet = require(`../../lib/exercise/exerciseGet`)

const config = require(`../../server/config`)

function getExerciseFromDatabase (request, response) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.exercise_get.requestHeader)
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
            const exerciseId = request.params.exerciseId

            Joi.validate({exercise_id: exerciseId}, schema.exercise_get.requestParams)
              .then(() => {
                exerciseGet({exercise_id: exerciseId})
                  .then(info => {
                    resolve(response
                      .status(info.status)
                      .send({
                        exercise: info.exercise
                      })
                    )
                  })
                  .catch(info => {
                    reject(response
                      .status(info.status)
                      .send({ message: info.message })
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
          }
        })
      })
      .catch(error => {
        console.log(error)

        reject(response
          .status(401)
          .send({
            message: `[${error.name}] ${error.details[0].message}`
          }))
      })
  })
}

module.exports = getExerciseFromDatabase
