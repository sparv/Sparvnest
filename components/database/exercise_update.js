const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function exerciseUpdate (request, response, tableExercise, config) {
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

            reject(response
              .status(401)
              .send({
                message: `JWT authentication failed`
              }))
          }

          const exerciseId = request.params.exerciseId

          Joi.validate({exercise_id: exerciseId}, schema.exercise_update.requestParams)
            .then(() => {
              Joi.validate(request.body, schema.exercise_update.requestBody)
                .then(() => {
                  tableExercise.findOne({
                    where: {
                      exercise_id: exerciseId
                    }
                  })
                    .then(exercise => {
                      const data = request.body
                      let updateData = {}

                      if (data.name !== null) updateData[`name`] = data.name
                      if (data.level !== null) updateData[`level`] = data.level
                      if (data.description !== null) updateData[`description`] = data.description

                      tableExercise.update(updateData, {
                        where: {
                          exercise_id: exerciseId
                        }
                      })
                        .then(() => {
                          resolve(response
                            .status(200)
                            .send({
                              message: `Exercise updated`
                            }))
                        })
                        .catch(error => {
                          console.log(error)
                          reject(response
                            .status(500)
                            .send({
                              message: `Exercise could not be updated by Database`
                            }))
                        })
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
            .catch(error => {
              console.log(error)

              reject(response
                .status(500)
                .send({
                  message: `[${error.name}] ${error.details[0].message}`
                }))
            })
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

module.exports = exerciseUpdate
