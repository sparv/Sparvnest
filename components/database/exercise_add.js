const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function exerciseAdd (request, response, tableExercise, config) {
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

            reject(response
              .status(401)
              .send({
                message: `JWT authentication failed`
              }))
          }

          Joi.validate(request.body, schema.exercise_add.requestBody)
            .then(() => {
              tableExercise.findOne({ where: {
                name: request.body.name,
                level: request.body.level
              } })
                .then((exercise) => {
                  if (exercise) {
                    reject(response
                      .status(400)
                      .send({
                        message: `exercise already exists`
                      }))
                  } else {
                    const data = request.body

                    tableExercise.create({
                      name: data.name,
                      level: data.level,
                      description: data.description
                    })
                      .then(exercise => {
                        resolve(response
                          .status(200)
                          .send({
                            message: `[STATUS] Exercise added`,
                            exercise: {
                              exercise_id: exercise.exercise_id,
                              name: exercise.name,
                              level: exercise.level,
                              description: exercise.description
                            }
                          }))
                      })
                      .catch(error => {
                        console.log(error)

                        reject(response
                          .status(500)
                          .send({
                            message: `[ERROR] Database failed to save exercise`
                          }))
                      })
                  }
                })
            })
            .catch((error) => {
              console.log(error)

              reject(response
                .status(500)
                .send({
                  message: `[ERROR] Response body object validation failed`
                }))
            })

        })
      })
  })
}

module.exports = exerciseAdd
