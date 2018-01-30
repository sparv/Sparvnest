const jwt = require(`jsonwebtoken`)
const Joi = require(`joi`)
const schema = require(`../routing/schemavalidation_request`)

function exerciseGroupDelete (request, response, tableExerciseGroup, config) {
  return new Promise((resolve, reject) => {
    let auth = {
      token: request.headers.authorization
    }

    Joi.validate(auth, schema.exercise_group_delete.requestHeader)
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
            const exerciseGroupId = request.params.exerciseGroupId

            Joi.validate({exercisegroup_id: exerciseGroupId}, schema.exercise_group_delete.requestParams)
              .then(() => {
                Joi.validate(request.body, schema.exercise_group_delete.requestBody)
                  .then(() => {
                    tableExerciseGroup.destroy({
                      where: {
                        exercisegroup_id: exerciseGroupId,
                        name: request.body.name
                      }
                    })
                      .then((affectedRows) => {
                        if (affectedRows === 0) {
                          reject(response
                            .status(400)
                            .send({
                              message: `No Exercise Group deleted`
                            }))
                        } else {
                          resolve(response
                            .status(200)
                            .send({
                              message: `Exercise Group deleted`
                            }))
                        }
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
                    message: `ExerciseGroupID not valid`
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

module.exports = exerciseGroupDelete
