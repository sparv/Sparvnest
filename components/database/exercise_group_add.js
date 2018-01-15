const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function exerciseGroupAdd (request, response, tableExerciseGroup, config) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.exercise_group_add.requestHeader)
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
            Joi.validate(request.body, schema.exercise_group_add.requestBody)
              .then(() => {
                tableExerciseGroup.findOne({ where: {
                  name: request.body.name
                } })
                  .then(exerciseGroup => {
                    if (exerciseGroup) {
                      reject(response
                        .status(400)
                        .send({
                          message: `exercise group already exists`
                        }))
                    } else {
                      const data = request.body

                      tableExerciseGroup.create({
                        name: data.name,
                        description: data.description,
                        exercises: []
                      })
                        //TODO evt Prüfung ob createdExerciseGroup valides Objekt ist oder undefined bzw. invalide
                        .then(createdExerciseGroup => {
                          resolve(response
                            .status(200)
                            .send({
                              message: `[STATUS] Exercise group added`,
                              exerciseGroup: {
                                name: createdExerciseGroup.name,
                                description: createdExerciseGroup.description,
                                exercises: createdExerciseGroup.exercises
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
          }
        })
      })
  })
}

module.exports = exerciseGroupAdd
