const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function exerciseGet (request, response, tableExercise, config) {
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
                tableExercise.findOne({ where: {
                  exercise_id: exerciseId
                } })
                  .then((exercise) => {
                    if (exercise === null) {
                      reject(response
                        .status(404)
                        .send({
                          message: `Exercise not found`
                        }))
                    } else {
                      resolve(response
                        .status(200)
                        .send({
                          exercise_id: exercise.exercise_id,
                          name: exercise.name,
                          level: exercise.level,
                          description: exercise.description
                        }))
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

module.exports = exerciseGet
