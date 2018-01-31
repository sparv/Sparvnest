const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../validation/requestSchemaValidation`)

const exerciseDelete = require(`../../lib/exercise/exerciseDelete`)

const config = require(`../../server/config`)

function deleteExerciseFromDatabase (request, response) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.exercise_delete.requestHeader)
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

            Joi.validate({exercise_id: exerciseId}, schema.exercise_delete.requestParams)
              .then(() => {
                Joi.validate(request.body, schema.exercise_delete.requestBody)
                  .then(() => {
                    exerciseDelete(exerciseId)
                      .then(info => {
                        resolve(response
                          .status(info.status)
                          .send({ message: info.message })
                        )
                      })
                  })
                  .catch(error => {
                    reject(response
                      .status(400)
                      .send({
                        message: `Request Body not valid`
                      }))
                  })
              })
              .catch(error => {
                reject(response
                  .status(400)
                  .send({
                    message: `ExerciseID not valid`
                  }))
              })
          }
        })
      })
      .catch(error => {
        reject(response
          .status(401)
          .send({
            message: `Request Header not valid`
          }))
      })
  })
}

module.exports = deleteExerciseFromDatabase
